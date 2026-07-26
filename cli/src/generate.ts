import path from "node:path";
import fs from "node:fs/promises";
import Handlebars from "handlebars";
import { pathExists, insertAtAnchorSafe } from "./fsutil.ts";
import type { FieldSpec, FieldType } from "./nlp.ts";

Handlebars.registerHelper("pascal", (s: string) => s[0].toUpperCase() + s.slice(1));
Handlebars.registerHelper("capitalize", (s: string) => s[0].toUpperCase() + s.slice(1));
Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper("ne", (a: unknown, b: unknown) => a !== b);

interface RenderedField {
  name: string;
  last: boolean;
  // TS bases
  tsType?: string;
  zodType?: string;
  drizzleField?: string;
  // Python bases
  pyType?: string;
  sqlType?: string;
}

const TS_TYPE: Record<FieldType, string> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  date: "string",
  relation: "string",
};
const ZOD_TYPE: Record<FieldType, string> = {
  string: "z.string()",
  number: "z.number()",
  boolean: "z.boolean()",
  date: "z.string()",
  relation: "z.string()",
};
const PY_TYPE: Record<FieldType, string> = {
  string: "str",
  number: "float",
  boolean: "bool",
  date: "str",
  relation: "str",
};
const SQL_TYPE: Record<FieldType, string> = {
  string: "TEXT",
  number: "REAL",
  boolean: "INTEGER",
  date: "TEXT",
  relation: "TEXT",
};

function drizzleColumn(name: string, type: FieldType): string {
  switch (type) {
    case "number":
      return `${name}: real("${name}")`;
    case "boolean":
      return `${name}: integer("${name}", { mode: "boolean" })`;
    case "date":
      return `${name}: integer("${name}", { mode: "timestamp" })`;
    default:
      return `${name}: text("${name}")`;
  }
}

interface ScaffoldWiring {
  file: string;
  anchor: string;
  insert: string;
}

interface ScaffoldConfig {
  language: "ts" | "python";
  templates: Record<string, string>; // template filename -> target path pattern, both may use {{entityName}}
  wiring: (ScaffoldWiring & { optional?: boolean })[];
}

export interface GeneratePageOptions {
  registryPath: string;
  targetDir: string;
  base: string;
  entityName: string;
  fields: FieldSpec[];
  auth: "protected" | "public";
}

export interface GeneratePageResult {
  filesWritten: string[];
  wiringApplied: string[];
  wiringSkipped: string[];
}

function substitute(pattern: string, entityName: string, entityNamePascal: string): string {
  return pattern.replaceAll("{{entityName}}", entityName).replaceAll("{{entityNamePascal}}", entityNamePascal);
}

export async function generatePage(opts: GeneratePageOptions): Promise<GeneratePageResult> {
  const { registryPath, targetDir, base, entityName, fields, auth } = opts;
  const scaffoldDir = path.join(registryPath, "pages", "_scaffold", base);
  const configPath = path.join(scaffoldDir, "scaffold.config.json");
  if (!(await pathExists(configPath))) {
    throw new Error(`No page-add scaffold available for base "${base}"`);
  }
  const config: ScaffoldConfig = JSON.parse(await fs.readFile(configPath, "utf-8"));
  const entityNamePascal = entityName[0].toUpperCase() + entityName.slice(1);

  const renderedFields: RenderedField[] = fields.map((f, i) => {
    const base: RenderedField = { name: f.name, last: i === fields.length - 1 };
    if (config.language === "python") {
      base.pyType = PY_TYPE[f.type];
      base.sqlType = SQL_TYPE[f.type];
    } else {
      base.tsType = TS_TYPE[f.type];
      base.zodType = ZOD_TYPE[f.type];
      base.drizzleField = drizzleColumn(f.name, f.type);
    }
    return base;
  });

  const vars = {
    entityName,
    entityNamePascal,
    fields: renderedFields,
    protected: auth === "protected",
  };

  const filesWritten: string[] = [];
  for (const [tpl, targetPattern] of Object.entries(config.templates)) {
    const tplPath = path.join(scaffoldDir, tpl);
    if (!(await pathExists(tplPath))) continue;
    const raw = await fs.readFile(tplPath, "utf-8");
    const rendered = Handlebars.compile(raw)(vars);
    const relTarget = substitute(targetPattern, entityName, entityNamePascal);
    const outPath = path.join(targetDir, relTarget);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, rendered);
    filesWritten.push(relTarget);
  }

  const wiringApplied: string[] = [];
  const wiringSkipped: string[] = [];
  for (const w of config.wiring ?? []) {
    const file = substitute(w.file, entityName, entityNamePascal);
    const insert = substitute(w.insert, entityName, entityNamePascal);
    const applied = await insertAtAnchorSafe(path.join(targetDir, file), w.anchor, insert);
    if (applied) wiringApplied.push(file);
    else wiringSkipped.push(`${file} (feature that owns this anchor isn't installed — wire it manually)`);
  }

  return { filesWritten, wiringApplied, wiringSkipped };
}
