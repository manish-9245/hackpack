import path from "node:path";
import fs from "node:fs/promises";
import { loadManifest, templateDir } from "./registry.ts";
import {
  copyTemplateDir,
  insertAtAnchor,
  mergeJsonFile,
  mergeTomlDependencyArray,
  appendEnvVars,
  pathExists,
} from "./fsutil.ts";
import type { HackpackManifest, HackpackLock, InstalledPage, TemplateManifest } from "./types.ts";

export interface ComposeOptions {
  registryPath: string;
  registryLabel: string;
  targetDir: string;
  projectName: string;
  base: string;
  features: string[];
  pages: string[];
  author?: string;
  description?: string;
  license?: "mit" | "apache-2.0" | "none";
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
}

export interface ComposeResult {
  postInstall: string[];
}

/** JS bases merge into package.json; Python bases merge into requirements.txt.
 * A manifest just declares whichever field(s) apply to its language. */
async function mergeManifestDeps(targetDir: string, manifest: TemplateManifest): Promise<void> {
  if (manifest.dependencies || manifest.devDependencies || manifest.scripts) {
    await mergeJsonFile(path.join(targetDir, "package.json"), {
      dependencies: manifest.dependencies,
      devDependencies: manifest.devDependencies,
      scripts: manifest.scripts,
    });
  }
  if (manifest.pyDependencies?.length) {
    await mergeTomlDependencyArray(path.join(targetDir, "pyproject.toml"), "dependencies", manifest.pyDependencies);
  }
}

/** Copies a template's file tree onto the project: shared files/ first, then an
 * optional files-<base>/ overlay for framework-specific integration code (e.g. how
 * an auth feature mounts its routes differs between Next.js, SvelteKit, Hono...). */
async function copyLayeredFiles(
  templateRoot: string,
  base: string,
  targetDir: string,
  vars: Record<string, string>,
): Promise<void> {
  const shared = path.join(templateRoot, "files");
  if (await pathExists(shared)) await copyTemplateDir(shared, targetDir, vars);
  const overlay = path.join(templateRoot, `files-${base}`);
  if (await pathExists(overlay)) await copyTemplateDir(overlay, targetDir, vars);
}

/** Layers one feature's files/deps/env/wiring onto an existing project directory.
 * Shared by `compose()` (new project) and the `add` command (post-init). */
export async function applyFeature(
  registryPath: string,
  targetDir: string,
  base: string,
  featureName: string,
  vars: Record<string, string>,
): Promise<{ postInstall: string[]; category?: string }> {
  const manifest = await loadManifest(registryPath, "feature", featureName);
  if (manifest.compatibleWith?.length && !manifest.compatibleWith.includes(base)) {
    throw new Error(`Feature "${featureName}" is not compatible with base "${base}"`);
  }

  await copyLayeredFiles(templateDir(registryPath, "feature", featureName), base, targetDir, vars);
  await mergeManifestDeps(targetDir, manifest);
  if (manifest.envVars?.length) {
    await appendEnvVars(path.join(targetDir, ".env.example"), manifest.envVars);
  }
  for (const w of manifest.wiring ?? []) {
    await insertAtAnchor(path.join(targetDir, w.file), w.anchor, w.insert);
  }

  return { postInstall: manifest.postInstall ?? [], category: manifest.category };
}

export async function compose(opts: ComposeOptions): Promise<ComposeResult> {
  const { registryPath, targetDir, projectName, base, features, pages } = opts;
  const author = opts.author ?? "";
  const description = opts.description ?? "";
  const license = opts.license ?? "mit";
  const packageManager = opts.packageManager ?? "npm";
  const vars = {
    projectName,
    author,
    description,
    year: String(new Date().getFullYear()),
    pm: packageManager,
  };
  const postInstall: string[] = [];

  // Universal hygiene layer (README, .editorconfig, .env.example baseline) —
  // copied before the base so a base can still override a file by shipping
  // its own same-named file (none currently do).
  const commonDir = path.join(registryPath, "_common");
  if (await pathExists(commonDir)) {
    await copyTemplateDir(commonDir, targetDir, vars);
  }
  if (license !== "none") {
    const licenseFile = license === "apache-2.0" ? "LICENSE-APACHE-2.0.hbs" : "LICENSE-MIT.hbs";
    const licenseSrc = path.join(commonDir, licenseFile);
    if (await pathExists(licenseSrc)) {
      const raw = await fs.readFile(licenseSrc, "utf-8");
      const Handlebars = (await import("handlebars")).default;
      await fs.writeFile(path.join(targetDir, "LICENSE"), Handlebars.compile(raw)(vars));
    }
  }

  const baseManifest = await loadManifest(registryPath, "base", base);
  await copyTemplateDir(templateDir(registryPath, "base", base), targetDir, vars);
  postInstall.push(...(baseManifest.postInstall ?? []));

  // categories map lets pages find "whichever auth feature was installed",
  // per the plan's "compose with selected auth feature, not a fixed default".
  const installedCategories: Record<string, string> = {};

  for (const feature of features) {
    const result = await applyFeature(registryPath, targetDir, base, feature, vars);
    if (result.category) installedCategories[result.category] = feature;
    postInstall.push(...result.postInstall);
  }

  const installedPages: InstalledPage[] = [];
  for (const page of pages) {
    const manifest = await loadManifest(registryPath, "page", page);
    if (manifest.compatibleWith?.length && !manifest.compatibleWith.includes(base)) {
      throw new Error(`Page "${page}" is not compatible with base "${base}"`);
    }
    const variant = manifest.requiresCategory
      ? (installedCategories[manifest.requiresCategory] ?? "none")
      : null;
    const pageRoot = templateDir(registryPath, "page", page);
    const sourceRoot = manifest.hasVariants ? path.join(pageRoot, "variants", variant ?? "none") : pageRoot;
    await copyLayeredFiles(sourceRoot, base, targetDir, { ...vars, entityName: page });

    await mergeManifestDeps(targetDir, manifest);
    for (const w of manifest.wiring ?? []) {
      await insertAtAnchor(path.join(targetDir, w.file), w.anchor, w.insert);
    }
    installedPages.push({ name: page, variant });
  }

  const hackpackJson: HackpackManifest = {
    base,
    features,
    pages: installedPages,
    createdAt: new Date().toISOString(),
    author: author || undefined,
    description: description || undefined,
    license,
    packageManager,
  };
  await fs.writeFile(path.join(targetDir, "hackpack.json"), JSON.stringify(hackpackJson, null, 2) + "\n");

  const lock: HackpackLock = {
    registry: opts.registryLabel,
    resolvedAt: new Date().toISOString(),
    base: { name: base, source: opts.registryLabel },
    features: features.map((name) => ({ name, source: opts.registryLabel })),
    pages: installedPages.map((p) => ({ ...p, source: opts.registryLabel })),
  };
  await fs.writeFile(path.join(targetDir, "hackpack.lock"), JSON.stringify(lock, null, 2) + "\n");

  return { postInstall: [...new Set(postInstall)] };
}
