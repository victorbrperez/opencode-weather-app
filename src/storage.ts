import { basename, dirname, join } from "node:path";
import type { Config } from "./types.ts";

// En binario compilado execPath es el propio ejecutable; en dev es el binario de bun
const isCompiled = !["bun", "bun.exe"].includes(basename(process.execPath).toLowerCase());
const baseDir = isCompiled ? dirname(process.execPath) : join(import.meta.dir, "..");
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
    // Config corrupto: se reinicia en lugar de crashear
    return structuredClone(EMPTY_CONFIG);
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
