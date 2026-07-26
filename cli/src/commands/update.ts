import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import { resolveRegistry } from "../registry.ts";
import { applyFeature } from "../compose.ts";
import type { HackpackManifest, HackpackLock } from "../types.ts";

export const updateCommand = defineCommand({
  meta: {
    name: "update",
    description: "Re-fetch and re-apply an installed feature from its registry source (check `git diff` after)",
  },
  args: {
    feature: { type: "positional", required: false, description: "Feature to update (default: all installed features)" },
    registry: { type: "string", description: "Override the registry source recorded in hackpack.lock" },
  },
  async run({ args }) {
    const targetDir = process.cwd();
    const manifest: HackpackManifest = JSON.parse(
      await fs.readFile(path.join(targetDir, "hackpack.json"), "utf-8").catch(() => {
        throw new Error("No hackpack.json here — run this inside a project created with `hackpack new`");
      }),
    );
    const lock: HackpackLock | null = JSON.parse(
      await fs.readFile(path.join(targetDir, "hackpack.lock"), "utf-8").catch(() => "null"),
    );

    const targets = args.feature ? [args.feature] : manifest.features;
    if (targets.length === 0) {
      console.log("No features installed.");
      return;
    }

    for (const feature of targets) {
      if (!manifest.features.includes(feature)) {
        throw new Error(`"${feature}" isn't installed in this project. Installed: ${manifest.features.join(", ")}`);
      }
      const source = args.registry ?? lock?.features.find((f) => f.name === feature)?.source;
      const registryPath = await resolveRegistry(source);
      console.log(`Updating ${feature} from ${source ?? "bundled"}...`);
      await applyFeature(registryPath, targetDir, manifest.base, feature, {
        projectName: path.basename(targetDir),
      });
    }
    console.log("Done. This overwrites files the feature owns — review `git diff` before committing.");
  },
});
