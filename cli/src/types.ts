export interface WiringInsert {
  file: string;
  anchor: string;
  insert: string;
}

export interface EnvVar {
  key: string;
  value: string;
  comment?: string;
}

export interface TemplateManifest {
  name: string;
  type: "base" | "feature" | "page";
  description?: string;
  category?: string;
  compatibleWith?: string[];
  requiresCategory?: string;
  hasVariants?: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  /** Merged into package.json "scripts" (JS bases only). */
  scripts?: Record<string, string>;
  /** Python bases: pip-style requirement strings merged into pyproject.toml's
   * [project] dependencies array (e.g. "fastapi>=0.115"). */
  pyDependencies?: string[];
  envVars?: EnvVar[];
  wiring?: WiringInsert[];
  postInstall?: string[];
  componentsNeeded?: string[];
}

export interface InstalledPage {
  name: string;
  variant: string | null;
}

export interface HackpackManifest {
  base: string;
  features: string[];
  pages: InstalledPage[];
  createdAt: string;
  author?: string;
  description?: string;
  license?: "mit" | "apache-2.0" | "none";
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
}

export interface HackpackLock {
  registry: string;
  resolvedAt: string;
  base: { name: string; source: string };
  features: { name: string; source: string }[];
  pages: { name: string; variant: string | null; source: string }[];
}
