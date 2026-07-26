import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { execa } from "execa";
import { resolveRegistry, listTemplates } from "../registry.ts";
import { applyFeature } from "../compose.ts";
import type { HackpackManifest, HackpackLock } from "../types.ts";

export const addCommand = defineCommand({
  meta: { name: "add", description: "Add a feature to the current project" },
  args: {
    feature: { type: "positional", required: false, description: "Feature name" },
    registry: { type: "string", description: "Path to a template registry" },
    install: { type: "boolean", description: "Run npm install after adding", default: true },
  },
  async run({ args }) {
    const targetDir = process.cwd();
    const manifestPath = path.join(targetDir, "hackpack.json");
    const raw = await fs.readFile(manifestPath, "utf-8").catch(() => {
      throw new Error("No hackpack.json here — run this inside a project created with `hackpack new`");
    });
    const manifest: HackpackManifest = JSON.parse(raw);

    const registryPath = await resolveRegistry(args.registry);
    const registryLabel = args.registry ?? "bundled";

    let feature = args.feature;
    if (!feature) {
      const available = (await listTemplates(registryPath, "feature")).filter(
        (f) => !manifest.features.includes(f.name) && (!f.compatibleWith?.length || f.compatibleWith.includes(manifest.base)),
      );
      const picked = await clack.select({
        message: "Add which feature?",
        options: available.map((f) => ({ value: f.name, label: f.name, hint: f.description })),
      });
      if (clack.isCancel(picked)) return;
      feature = picked as string;
    }

    if (manifest.features.includes(feature)) {
      console.log(`"${feature}" is already installed.`);
      return;
    }

    const spinner = clack.spinner();
    spinner.start(`Adding ${feature}`);
    const { postInstall } = await applyFeature(registryPath, targetDir, manifest.base, feature, {
      projectName: path.basename(targetDir),
    });
    manifest.features.push(feature);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

    const lockPath = path.join(targetDir, "hackpack.lock");
    const lock: HackpackLock = JSON.parse(await fs.readFile(lockPath, "utf-8").catch(() => "null")) ?? {
      registry: registryLabel,
      resolvedAt: new Date().toISOString(),
      base: { name: manifest.base, source: registryLabel },
      features: [],
      pages: [],
    };
    lock.features.push({ name: feature, source: registryLabel });
    await fs.writeFile(lockPath, JSON.stringify(lock, null, 2) + "\n");
    spinner.stop(`Added ${feature}`);

    if (args.install) {
      const installSpinner = clack.spinner();
      installSpinner.start("Installing dependencies");
      await execa("npm", ["install"], { cwd: targetDir });
      installSpinner.stop("Dependencies installed");
      for (const cmd of postInstall) {
        const [bin, ...rest] = cmd.split(" ");
        await execa(bin, rest, { cwd: targetDir });
      }
    }
  },
});
