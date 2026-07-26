import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { execa } from "execa";
import { resolveRegistry, listTemplates } from "../registry.ts";
import { compose } from "../compose.ts";
import { pathExists } from "../fsutil.ts";

function splitCsv(value?: string): string[] {
  return value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
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
    install: { type: "boolean", description: "Run npm install after scaffolding", default: true },
  },
  async run({ args }) {
    const registryPath = await resolveRegistry(args.registry);
    const registryLabel = args.registry ?? "bundled";

    const interactive = !args.yes;
    if (interactive) clack.intro("hackpack");

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
    });
    spinner?.stop("Project composed");

    if (args.install) {
      const installSpinner = interactive ? clack.spinner() : null;
      installSpinner?.start("Installing dependencies");
      await execa("npm", ["install"], { cwd: targetDir });
      installSpinner?.stop("Dependencies installed");

      for (const cmd of postInstall) {
        const [bin, ...rest] = cmd.split(" ");
        const cmdSpinner = interactive ? clack.spinner() : null;
        cmdSpinner?.start(cmd);
        await execa(bin, rest, { cwd: targetDir });
        cmdSpinner?.stop(cmd);
      }
    }

    const summary = [
      `cd ${projectName}`,
      ...(args.install ? [] : ["npm install"]),
      "npm run dev",
      "npx hackpack deploy   # when ready to ship",
    ].join("\n  ");

    if (interactive) {
      clack.outro(`Done. Next steps:\n\n  ${summary}`);
    } else {
      console.log(`Done. Next steps:\n  ${summary}`);
    }
  },
});
