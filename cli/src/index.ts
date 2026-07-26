import { defineCommand } from "citty";
import { newCommand } from "./commands/new.ts";
import { addCommand } from "./commands/add.ts";
import { pageAddCommand } from "./commands/pageAdd.ts";
import { deployCommand } from "./commands/deploy.ts";
import { registryCommand } from "./commands/registry.ts";
import { updateCommand } from "./commands/update.ts";
import { updateVendorCommand } from "./commands/updateVendor.ts";

const pageCommand = defineCommand({
  meta: { name: "page", description: "Page-level generators" },
  subCommands: { add: pageAddCommand },
});

export const main = defineCommand({
  meta: {
    name: "hackpack",
    version: "0.1.0",
    description: "Scaffold a hackathon project — base + features + pages — and deploy it to Cloudflare Workers",
  },
  subCommands: {
    new: newCommand,
    add: addCommand,
    page: pageCommand,
    deploy: deployCommand,
    registry: registryCommand,
    update: updateCommand,
    "update-vendor": updateVendorCommand,
  },
});
