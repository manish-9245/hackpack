import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { execa } from "execa";
import { resolveRegistry, listTemplates } from "../registry.ts";
import { compose } from "../compose.ts";
import { pathExists, installCommandFor } from "../fsutil.ts";
import { showWelcome } from "../banner.ts";

function splitCsv(value?: string): string[] {
  return value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

async function defaultAuthor(): Promise<string> {
  try {
    const { stdout } = await execa("git", ["config", "user.name"]);
    return stdout.trim();
  } catch {
    return "";
  }
}

export const newCommand = defineCommand({
  meta: { name: "new", description: "Scaffold a new hackathon project" },
  args: {
    name: { type: "positional", required: false, description: "Project name / directory" },
    base: { type: "string", description: "Base template name (e.g. ts-nextjs)" },
    features: { type: "string", description: "Comma-separated feature names" },
    pages: { type: "string", description: "Comma-separated page names" },
    registry: { type: "string", description: "Path to a template registry (defaults to the bundled one)" },
    yes: { type: "boolean", description: "Skip prompts, accept defaults, run installs non-interactively" },
    install: { type: "boolean", description: "Run the install command after scaffolding", default: true },
    pm: { type: "string", description: "Package manager: npm | pnpm | yarn | bun", default: "npm" },
    git: { type: "boolean", description: "Run git init + first commit", default: true },
    license: { type: "string", description: "License: mit | apache-2.0 | none", default: "mit" },
    author: { type: "string", description: "Author/org name (used in LICENSE, package.json, README)" },
    description: { type: "string", description: "Project description", default: "" },
  },
  async run({ args }) {
    const registryPath = await resolveRegistry(args.registry);
    const registryLabel = args.registry ?? "bundled";

    const interactive = !args.yes;
    if (interactive) {
      showWelcome();
      clack.intro("hackpack new");
    }

    const projectName =
      args.name ??
      (interactive
        ? String(await clack.text({ message: "Project name", placeholder: "my-hack" }))
        : (() => {
            throw new Error("Project name is required (pass it positionally or with --yes and a default)");
          })());

    const targetDir = path.resolve(process.cwd(), projectName);
    if (await pathExists(targetDir)) {
      const files = await fs.readdir(targetDir);
      if (files.length > 0) throw new Error(`Directory "${projectName}" already exists and isn't empty`);
    }

    const bases = await listTemplates(registryPath, "base");
    let base = args.base;
    if (!base) {
      if (!interactive) throw new Error("--base is required with --yes");
      base = String(
        await clack.select({
          message: "Base template",
          options: bases.map((b) => ({ value: b.name, label: b.name, hint: b.description })),
        }),
      );
    }
    if (!bases.some((b) => b.name === base)) {
      throw new Error(`Unknown base "${base}". Available: ${bases.map((b) => b.name).join(", ")}`);
    }

    const allFeatures = (await listTemplates(registryPath, "feature")).filter(
      (f) => !f.compatibleWith?.length || f.compatibleWith.includes(base),
    );
    let features = splitCsv(args.features);
    if (!args.features && interactive) {
      const picked = await clack.multiselect({
        message: "Features",
        options: allFeatures.map((f) => ({ value: f.name, label: f.name, hint: f.description })),
        required: false,
      });
      features = clack.isCancel(picked) ? [] : (picked as string[]);
    }

    const allPages = (await listTemplates(registryPath, "page")).filter(
      (p) => !p.compatibleWith?.length || p.compatibleWith.includes(base),
    );
    let pages = splitCsv(args.pages);
    if (!args.pages && interactive) {
      const picked = await clack.multiselect({
        message: "Pages",
        options: allPages.map((p) => ({ value: p.name, label: p.name, hint: p.description })),
        required: false,
      });
      pages = clack.isCancel(picked) ? [] : (picked as string[]);
    }

    // --- v1.6 customization surface ---
    let packageManager = args.pm;
    if (!args.pm && interactive) {
      packageManager = String(
        await clack.select({
          message: "Package manager",
          options: [
            { value: "npm", label: "npm" },
            { value: "pnpm", label: "pnpm" },
            { value: "yarn", label: "yarn" },
            { value: "bun", label: "bun" },
          ],
          initialValue: "npm",
        }),
      );
    }

    let gitInit = args.git;
    if (interactive) {
      const picked = await clack.confirm({ message: "Initialize a git repository?", initialValue: true });
      gitInit = clack.isCancel(picked) ? false : picked;
    }

    let license = args.license;
    if (!args.license && interactive) {
      license = String(
        await clack.select({
          message: "License",
          options: [
            { value: "mit", label: "MIT" },
            { value: "apache-2.0", label: "Apache 2.0" },
            { value: "none", label: "None" },
          ],
          initialValue: "mit",
        }),
      );
    }

    let author = args.author;
    if (author === undefined) {
      const gitAuthor = await defaultAuthor();
      author = interactive
        ? String(await clack.text({ message: "Author/org name", placeholder: gitAuthor || "Jane Doe", initialValue: gitAuthor }))
        : gitAuthor;
    }

    let description = args.description;
    if (!args.description && interactive) {
      const picked = await clack.text({ message: "Project description", placeholder: "(optional)" });
      description = clack.isCancel(picked) ? "" : String(picked);
    }

    const spinner = interactive ? clack.spinner() : null;
    spinner?.start("Composing project");
    const { postInstall } = await compose({
      registryPath,
      registryLabel,
      targetDir,
      projectName,
      base,
      features,
      pages,
      author,
      description,
      license: license as "mit" | "apache-2.0" | "none",
      packageManager: packageManager as "npm" | "pnpm" | "yarn" | "bun",
    });
    spinner?.stop("Project composed");

    if (gitInit) {
      const gitSpinner = interactive ? clack.spinner() : null;
      gitSpinner?.start("Initializing git repository");
      await execa("git", ["init"], { cwd: targetDir });
      await execa("git", ["add", "-A"], { cwd: targetDir });
      await execa("git", ["commit", "-m", "Initial commit (hackpack scaffold)"], { cwd: targetDir }).catch(() => {
        // no git user configured yet — leave the repo initialized but uncommitted rather than failing the scaffold
      });
      gitSpinner?.stop("Git repository initialized");
    }

    if (args.install) {
      const [bin, installArgs] = installCommandFor(packageManager);
      const installSpinner = interactive ? clack.spinner() : null;
      installSpinner?.start(`Installing dependencies (${bin})`);
      await execa(bin, installArgs, { cwd: targetDir });
      installSpinner?.stop("Dependencies installed");

      for (const cmd of postInstall) {
        const [postBin, ...rest] = cmd.split(" ");
        const cmdSpinner = interactive ? clack.spinner() : null;
        cmdSpinner?.start(cmd);
        await execa(postBin, rest, { cwd: targetDir });
        cmdSpinner?.stop(cmd);
      }
    }

    const [pmBin] = installCommandFor(packageManager);
    const summary = [
      `cd ${projectName}`,
      ...(args.install ? [] : [`${pmBin} install`]),
      `${pmBin} run dev`,
      "npx hackpack deploy   # when ready to ship",
    ].join("\n  ");

    if (interactive) {
      clack.outro(`Done. Next steps:\n\n  ${summary}`);
    } else {
      console.log(`Done. Next steps:\n  ${summary}`);
    }
  },
});
