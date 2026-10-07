import { basename, dirname, join } from "node:path";
import type { Config } from "../types/Weather.ts";

const isCompiled = !["bun", "bun.exe"].includes(basename(process.execPath).toLowerCase());
const baseDir = isCompiled ? dirname(process.execPath) : join(import.meta.dir, "../..");
const CONFIG_PATH = join(baseDir, "weather-config.json");

const EMPTY_CONFIG: Config = {
  defaultCity: null,
  cities: [],
  unit: "celsius",
};

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
  if (!(await file.exists())) return structuredClone(EMPTY_CONFIG);

  try {
    return (await file.json()) as Config;
  } catch {
    return structuredClone(EMPTY_CONFIG);
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
