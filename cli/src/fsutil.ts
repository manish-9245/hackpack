import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";

/** Recursively copy `src` into `dest`. Files ending in `.hbs` are compiled with
 * `vars` and written without the `.hbs` suffix; everything else is copied verbatim. */
export async function copyTemplateDir(
  src: string,
  dest: string,
  vars: Record<string, string>,
): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    if (entry.name === "template.config.json" || entry.name === "page.config.json") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyTemplateDir(from, to, vars);
    } else if (entry.name.endsWith(".hbs")) {
      const raw = await fs.readFile(from, "utf-8");
      const rendered = Handlebars.compile(raw)(vars);
      await fs.writeFile(to.slice(0, -4), rendered);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

export async function pathExists(p: string): Promise<boolean> {
  return fs
    .stat(p)
    .then(() => true)
    .catch(() => false);
}

/** Insert `content` immediately above the line containing `anchor`, keeping the
 * anchor in place so later composes can insert again at the same spot. */
export async function insertAtAnchor(
  filePath: string,
  anchor: string,
  content: string,
): Promise<void> {
  const text = await fs.readFile(filePath, "utf-8");
  const lines = text.split("\n");
  const idx = lines.findIndex((l) => l.includes(anchor));
  if (idx === -1) {
    throw new Error(`Anchor "${anchor}" not found in ${filePath}`);
  }
  const indent = lines[idx].slice(0, lines[idx].indexOf(anchor));
  lines.splice(idx, 0, `${indent}${content}`);
  await fs.writeFile(filePath, lines.join("\n"));
}

/** Best-effort variant of insertAtAnchor for optional wiring targets (e.g. a nav
 * component that only exists if the dashboard page was installed). Returns
 * whether the insert happened instead of throwing. */
export async function insertAtAnchorSafe(
  filePath: string,
  anchor: string,
  content: string,
): Promise<boolean> {
  try {
    await insertAtAnchor(filePath, anchor, content);
    return true;
  } catch {
    return false;
  }
}

export async function mergeJsonFile(
  filePath: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const raw = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(raw);
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      json[key] = { ...(json[key] ?? {}), ...value };
    } else {
      json[key] = value;
    }
  }
  await fs.writeFile(filePath, JSON.stringify(json, null, 2) + "\n");
}

const pkgNameOf = (spec: string) => spec.split(/[=<>~!\[; ]/)[0].trim().toLowerCase();

/** Appends pip-style requirement strings into a pyproject.toml `dependencies = [...]`
 * array, skipping packages already listed (matched on name, ignoring version specs).
 * A deliberately narrow regex edit rather than a full TOML parse — safe as long as
 * the array is a single contiguous `key = [ ... ]` block, which every base template
 * here controls. */
export async function mergeTomlDependencyArray(filePath: string, key: string, items: string[]): Promise<void> {
  if (items.length === 0) return;
  const text = await fs.readFile(filePath, "utf-8");
  const re = new RegExp(`${key}\\s*=\\s*\\[([^\\]]*)\\]`, "s");
  const match = text.match(re);
  if (!match) throw new Error(`Could not find "${key} = [...]" in ${filePath}`);

  const existing = Array.from(match[1].matchAll(/"([^"]+)"/g)).map((m) => m[1]);
  const existingNames = new Set(existing.map(pkgNameOf));
  const toAdd = items.filter((i) => !existingNames.has(pkgNameOf(i)));
  if (toAdd.length === 0) return;

  const merged = [...existing, ...toAdd];
  const rebuilt = `${key} = [\n${merged.map((m) => `    "${m}",`).join("\n")}\n]`;
  await fs.writeFile(filePath, text.slice(0, match.index) + rebuilt + text.slice((match.index ?? 0) + match[0].length));
}

export async function appendEnvVars(
  filePath: string,
  vars: { key: string; value: string; comment?: string }[],
): Promise<void> {
  if (vars.length === 0) return;
  const existing = (await pathExists(filePath)) ? await fs.readFile(filePath, "utf-8") : "";
  const lines = vars.map((v) => (v.comment ? `# ${v.comment}\n${v.key}=${v.value}` : `${v.key}=${v.value}`));
  const sep = existing && !existing.endsWith("\n") ? "\n" : "";
  await fs.writeFile(filePath, existing + sep + lines.join("\n") + "\n");
}

const PM_INSTALL: Record<string, [string, string[]]> = {
  npm: ["npm", ["install"]],
  pnpm: ["pnpm", ["install"]],
  yarn: ["yarn", []],
  bun: ["bun", ["install"]],
};

/** Maps a package manager name to its install command + args. Falls back to npm
 * for anything unrecognized rather than throwing — scaffolding shouldn't hard-fail
 * over a typo'd --pm value. */
export function installCommandFor(packageManager: string | undefined): [string, string[]] {
  return PM_INSTALL[packageManager ?? "npm"] ?? PM_INSTALL.npm;
}
