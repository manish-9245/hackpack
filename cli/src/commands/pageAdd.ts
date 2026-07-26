import path from "node:path";
import fs from "node:fs/promises";
import { defineCommand } from "citty";
import * as clack from "@clack/prompts";
import { resolveRegistry } from "../registry.ts";
import { generatePage } from "../generate.ts";
import { parseDescription, type FieldSpec, type FieldType } from "../nlp.ts";
import type { HackpackManifest } from "../types.ts";

const VALID_TYPES: FieldType[] = ["string", "number", "boolean", "date", "relation"];

function parseFieldsFlag(csv: string): FieldSpec[] {
  return csv.split(",").map((entry) => {
    const [name, type] = entry.split(":").map((s) => s.trim());
    if (!name || !type || !VALID_TYPES.includes(type as FieldType)) {
      throw new Error(`Invalid --fields entry "${entry}". Expected name:type, type one of ${VALID_TYPES.join("|")}`);
    }
    return { name, type: type as FieldType };
  });
}

export const pageAddCommand = defineCommand({
  meta: { name: "add", description: "Generate a CRUD page (route + API + DB schema) in the current project" },
  args: {
    name: { type: "positional", required: false, description: "Entity name, e.g. orders" },
    fields: { type: "string", description: "Comma-separated name:type fields" },
    auth: { type: "string", description: "protected | public" },
    describe: { type: "string", description: 'Free-text description, e.g. "a page for orders with a title, a price, and a user relation, behind login"' },
    registry: { type: "string" },
  },
  async run({ args }) {
    const targetDir = process.cwd();
    const manifest: HackpackManifest = JSON.parse(
      await fs.readFile(path.join(targetDir, "hackpack.json"), "utf-8").catch(() => {
        throw new Error("No hackpack.json here — run this inside a project created with `hackpack new`");
      }),
    );
    const registryPath = await resolveRegistry(args.registry);

    let entityName = args.name;
    let fields: FieldSpec[] = args.fields ? parseFieldsFlag(args.fields) : [];
    let auth = args.auth as "protected" | "public" | undefined;

    if (args.describe) {
      const parsed = parseDescription(args.describe);
      entityName ??= parsed.entity ?? undefined;
      if (fields.length === 0) fields = parsed.fields;
      auth ??= parsed.auth ?? undefined;

      clack.intro("Parsed from description (local NLP, no network call)");
      clack.log.info(
        `entity: ${entityName ?? "(unknown)"}\n` +
          `fields: ${fields.length ? fields.map((f) => `${f.name}:${f.type}`).join(", ") : "(none)"}\n` +
          `auth:   ${auth ?? "public (default)"}`,
      );

      if (parsed.confidence === "low" || !entityName || fields.length === 0) {
        if (!entityName) {
          entityName = String(await clack.text({ message: "Entity name?", placeholder: "orders" }));
        }
        if (fields.length === 0) {
          const raw = String(
            await clack.text({
              message: "Fields? (name:type, comma-separated)",
              placeholder: "title:string,price:number,userId:relation",
            }),
          );
          fields = parseFieldsFlag(raw);
        }
      } else {
        const ok = await clack.confirm({ message: "Generate with this spec?" });
        if (clack.isCancel(ok) || !ok) {
          clack.outro("Cancelled.");
          return;
        }
      }
    }

    if (!entityName) throw new Error("Entity name is required (positional arg, --describe, or prompt)");
    if (fields.length === 0) throw new Error("At least one field is required (--fields or --describe)");

    const result = await generatePage({
      registryPath,
      targetDir,
      base: manifest.base,
      entityName,
      fields,
      auth: auth ?? "public",
    });

    console.log(`Generated:\n  ${result.filesWritten.join("\n  ")}`);
    if (result.wiringApplied.length) console.log(`Wired into:\n  ${result.wiringApplied.join("\n  ")}`);
    if (result.wiringSkipped.length) console.log(`Skipped wiring (add manually):\n  ${result.wiringSkipped.join("\n  ")}`);
  },
});
