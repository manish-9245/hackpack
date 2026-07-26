import nlp from "compromise";

export type FieldType = "string" | "number" | "boolean" | "date" | "relation";
export interface FieldSpec {
  name: string;
  type: FieldType;
}
export interface ParsedPageSpec {
  entity: string | null;
  fields: FieldSpec[];
  auth: "protected" | "public" | null;
  /** "high" only when both an entity and at least one field were confidently
   * extracted — anything else should fall back to interactive prompts rather
   * than silently guessing (this is the trust-boundary check for the parser). */
  confidence: "high" | "low";
}

const EXPLICIT_TYPE_WORDS: Record<string, FieldType> = {
  string: "string",
  text: "string",
  number: "number",
  int: "number",
  integer: "number",
  float: "number",
  boolean: "boolean",
  bool: "boolean",
  flag: "boolean",
  date: "date",
  datetime: "date",
  time: "date",
  relation: "relation",
  reference: "relation",
  ref: "relation",
};

const GUESS_NUMBER = /^(price|amount|cost|total|count|quantity|qty|rating|age|score|number)$/i;
const GUESS_BOOLEAN = /^(is|has)[A-Z]|^(done|active|completed|published|enabled|verified|archived)$/;
const GUESS_DATE = /(date|At)$/;

const PROTECTED_RE = /\b(behind (a )?login|protected|requires? auth(entication)?|logged[- ]in|private|auth[- ]?gated)\b/i;
const PUBLIC_RE = /\b(public|open|no login|unauthenticated)\b/i;

function toCamel(words: string[]): string {
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseAuth(text: string): "protected" | "public" | null {
  if (PROTECTED_RE.test(text)) return "protected";
  if (PUBLIC_RE.test(text)) return "public";
  return null;
}

function parseEntity(text: string): string | null {
  const match = text.match(/\bfor\s+(?:an?|the)?\s*([a-z0-9][a-z0-9_ -]*?)(?=\s+with\b|\s+that\b|\s+behind\b|\s+which\b|$)/i);
  if (!match) return null;
  const phrase = match[1].trim();
  if (!phrase) return null;
  // singularize isn't applied — plural resource names ("orders") match the
  // route/table naming convention used by explicit `hackpack page add <name>`.
  return slugify(phrase) || null;
}

function parseField(rawPhrase: string): FieldSpec | null {
  const tokens = rawPhrase
    .trim()
    .split(/\s+/)
    .filter((t) => t && !/^(a|an|the)$/i.test(t));
  if (tokens.length === 0) return null;

  let type: FieldType | null = null;
  const nameTokens: string[] = [];
  for (const token of tokens) {
    const lower = token.toLowerCase().replace(/[.,]/g, "");
    if (!type && EXPLICIT_TYPE_WORDS[lower]) {
      type = EXPLICIT_TYPE_WORDS[lower];
      continue;
    }
    nameTokens.push(token.replace(/[.,]/g, ""));
  }
  if (nameTokens.length === 0) return null;

  let name = toCamel(nameTokens);
  if (!type) {
    if (GUESS_NUMBER.test(name)) type = "number";
    else if (GUESS_BOOLEAN.test(name)) type = "boolean";
    else if (GUESS_DATE.test(name)) type = "date";
    else type = "string";
  }
  if (type === "relation" && !/Id$/.test(name)) name = `${name}Id`;

  return { name, type };
}

function parseFields(text: string): FieldSpec[] {
  const match = text.match(/\bwith\s+(.+?)(?=\s+behind\b|\s+that\b|$)/i);
  if (!match) return [];
  const listText = match[1];
  const parts = listText
    .split(/,| and /i)
    .map((p) => p.trim())
    .filter(Boolean);
  const fields: FieldSpec[] = [];
  for (const part of parts) {
    const field = parseField(part);
    if (field) fields.push(field);
  }
  return fields;
}

export function parseDescription(description: string): ParsedPageSpec {
  const doc = nlp(description);
  void doc; // reserved for future noun-phrase disambiguation; regex heuristics cover MVP phrasing

  const entity = parseEntity(description);
  const fields = parseFields(description);
  const auth = parseAuth(description);

  return {
    entity,
    fields,
    auth,
    confidence: entity && fields.length > 0 ? "high" : "low",
  };
}
