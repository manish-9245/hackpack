import { defineCommand } from "citty";
import { addRegistry, removeRegistry, readConfig } from "../config.ts";

const registryAdd = defineCommand({
  meta: { name: "add", description: "Save a named registry source for reuse (e.g. a team's own template repo)" },
  args: {
    name: { type: "positional", required: true, description: "Short name, e.g. \"acme\"" },
    source: {
      type: "positional",
      required: true,
      description: 'Local path or git source, e.g. "github:acme/hackpack-templates"',
    },
  },
  async run({ args }) {
    await addRegistry(args.name, args.source);
    console.log(`Saved registry "${args.name}" -> ${args.source}`);
    console.log(`Use it with: hackpack new --registry=${args.name}`);
  },
});

const registryRemove = defineCommand({
  meta: { name: "remove", description: "Remove a saved registry" },
  args: {
    name: { type: "positional", required: true },
  },
  async run({ args }) {
    await removeRegistry(args.name);
    console.log(`Removed registry "${args.name}"`);
  },
});

const registryList = defineCommand({
  meta: { name: "list", description: "List saved registries" },
  async run() {
    const config = await readConfig();
    const entries = Object.entries(config.registries);
    if (entries.length === 0) {
      console.log("No saved registries. Add one with: hackpack registry add <name> <source>");
      return;
    }
    for (const [name, source] of entries) console.log(`${name}  ->  ${source}`);
  },
});

export const registryCommand = defineCommand({
  meta: { name: "registry", description: "Manage template registry sources" },
  subCommands: { add: registryAdd, remove: registryRemove, list: registryList },
});
