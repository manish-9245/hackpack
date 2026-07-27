import { fileURLToPath } from "node:url";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { downloadTemplate } from "giget";
import type { TemplateManifest } from "./types.ts";
import { readConfig, CACHE_DIR } from "./config.ts";

const CLI_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Published package ships templates/ next to src/ (see prepack script). In the
// monorepo checkout it instead lives one level up, alongside cli/.
const BUNDLED_REGISTRY = path.join(CLI_DIR, "templates");
const MONOREPO_REGISTRY = path.join(CLI_DIR, "..", "templates");

/** Resolves a registry to a local directory: the bundled default, a local path, a
 * name saved via `hackpack registry add`, or a remote git source (anything giget
 * understands — "github:org/repo", "gitlab:org/repo#branch", a raw https URL, ...).
 * Remote sources are cached under ~/.hackpack/cache so repeat `new`/`add` calls
 * don't re-fetch every time; pass a fresh source (e.g. append #branch) to bust it. */
export async function resolveRegistry(registryArg?: string): Promise<string> {
  if (!registryArg) {
    return (await pathIsDirectory(BUNDLED_REGISTRY)) ? BUNDLED_REGISTRY : MONOREPO_REGISTRY;
  }

  const config = await readConfig();
  const source = config.registries[registryArg] ?? registryArg;

  const localPath = path.resolve(process.cwd(), source);
  if (await pathIsDirectory(localPath)) return localPath;

  const slug = crypto.createHash("sha1").update(source).digest("hex").slice(0, 16);
  const dest = path.join(CACHE_DIR, slug);
  const { dir } = await downloadTemplate(source, { dir: dest, forceClean: false });
  return dir;
}

async function pathIsDirectory(p: string): Promise<boolean> {
  const stat = await fs.stat(p).catch(() => null);
  return stat?.isDirectory() ?? false;
}

const KIND_DIR = { base: "bases", feature: "features", page: "pages" } as const;

export async function listTemplates(
  registryPath: string,
  kind: keyof typeof KIND_DIR,
): Promise<TemplateManifest[]> {
  const dir = path.join(registryPath, KIND_DIR[kind]);
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const manifests: TemplateManifest[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifest = await loadManifest(registryPath, kind, entry.name).catch(() => null);
    if (manifest) manifests.push(manifest);
  }
  return manifests;
}

export async function loadManifest(
  registryPath: string,
  kind: keyof typeof KIND_DIR,
  name: string,
): Promise<TemplateManifest> {
  const configPath = path.join(
    registryPath,
    KIND_DIR[kind],
    name,
    kind === "page" ? "page.config.json" : "template.config.json",
  );
  const raw = await fs.readFile(configPath, "utf-8");
  return JSON.parse(raw) as TemplateManifest;
}

export function templateDir(
  registryPath: string,
  kind: keyof typeof KIND_DIR,
  name: string,
): string {
  return path.join(registryPath, KIND_DIR[kind], name);
}
