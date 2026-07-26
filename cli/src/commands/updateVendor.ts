import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import { resolveRegistry, templateDir } from "../registry.ts";

interface VendorEntry {
  source: string;
  path: string;
  vendoredAt: string;
  license?: string;
}

// shadcn registry JSON shape (what ui.aceternity.com and ui.shadcn.com both serve):
// { files: [{ path, type, content }] }
interface RegistryFile {
  files: { content: string }[];
}

export const updateVendorCommand = defineCommand({
  meta: {
    name: "update-vendor",
    description: "Re-fetch a vendored feature's components from their recorded upstream source (registry-maintenance command, not for use inside a generated project)",
  },
  args: {
    feature: { type: "positional", required: true, description: "e.g. ui-aceternity" },
    registry: { type: "string" },
  },
  async run({ args }) {
    const registryPath = await resolveRegistry(args.registry);
    const featureRoot = templateDir(registryPath, "feature", args.feature);
    const metaPath = path.join(featureRoot, "_meta.json");
    const meta: Record<string, VendorEntry> = JSON.parse(
      await fs.readFile(metaPath, "utf-8").catch(() => {
        throw new Error(`No _meta.json for "${args.feature}" — it isn't a vendored feature`);
      }),
    );

    for (const [name, entry] of Object.entries(meta)) {
      console.log(`Fetching ${name} from ${entry.source}...`);
      const res = await fetch(entry.source);
      if (!res.ok) throw new Error(`Failed to fetch ${entry.source}: ${res.status}`);
      const registryFile = (await res.json()) as RegistryFile;
      const content = registryFile.files?.[0]?.content;
      if (!content) throw new Error(`No file content found in ${entry.source}`);
      await fs.writeFile(path.join(featureRoot, entry.path), content);
      entry.vendoredAt = new Date().toISOString().slice(0, 10);
      console.log(`  updated ${entry.path}`);
    }

    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
    console.log(`Done. Review the diff in ${path.relative(process.cwd(), featureRoot)} before committing.`);
  },
});
