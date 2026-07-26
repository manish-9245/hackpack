import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { pathExists } from "./fsutil.ts";

export interface HackpackConfig {
  registries: Record<string, string>;
}

const CONFIG_DIR = path.join(os.homedir(), ".hackpack");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
export const CACHE_DIR = path.join(CONFIG_DIR, "cache");

export async function readConfig(): Promise<HackpackConfig> {
  if (!(await pathExists(CONFIG_PATH))) return { registries: {} };
  return JSON.parse(await fs.readFile(CONFIG_PATH, "utf-8"));
}

export async function writeConfig(config: HackpackConfig): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
}

export async function addRegistry(name: string, source: string): Promise<void> {
  const config = await readConfig();
  config.registries[name] = source;
  await writeConfig(config);
}

export async function removeRegistry(name: string): Promise<void> {
  const config = await readConfig();
  delete config.registries[name];
  await writeConfig(config);
}
