import { afterEach, describe, expect, test } from "bun:test";
import { basename, dirname, join } from "node:path";
import { rm, readFile, writeFile } from "node:fs/promises";
import { loadConfig, saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/Weather.ts";

const isCompiled = !["bun", "bun.exe"].includes(basename(process.execPath).toLowerCase());
const baseDir = isCompiled ? dirname(process.execPath) : join(import.meta.dir, "../..");
const CONFIG_PATH = join(baseDir, "weather-config.json");
const EMPTY_CONFIG: Config = {
  defaultCity: null,
  cities: [],
  unit: "celsius",
};

const originalConfig = await (async () => {
  try {
    return await readFile(CONFIG_PATH, "utf8");
  } catch {
    return null;
  }
})();

afterEach(async () => {
  if (originalConfig === null) {
    await rm(CONFIG_PATH, { force: true });
    return;
  }

  await writeFile(CONFIG_PATH, originalConfig, "utf8");
});

describe("settingsStorage", () => {
  test("loadConfig returns the default config when the file does not exist", async () => {
    await rm(CONFIG_PATH, { force: true });

    await expect(loadConfig()).resolves.toEqual(EMPTY_CONFIG);
  });

  test("loadConfig parses a valid JSON config file", async () => {
    const config: Config = {
      defaultCity: {
        name: "Madrid",
        country: "Spain",
        latitude: 40.4168,
        longitude: -3.7038,
      },
      cities: [
        {
          name: "Barcelona",
          country: "Spain",
          latitude: 41.3851,
          longitude: 2.1734,
        },
      ],
      unit: "fahrenheit",
    };

    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");

    await expect(loadConfig()).resolves.toEqual(config);
  });

  test("loadConfig falls back to defaults for invalid JSON", async () => {
    await writeFile(CONFIG_PATH, "{not-valid-json", "utf8");

    await expect(loadConfig()).resolves.toEqual(EMPTY_CONFIG);
  });

  test("saveConfig writes the config to disk", async () => {
    const config: Config = {
      defaultCity: {
        name: "Santo Domingo",
        country: "Dominican Republic",
        latitude: 18.4861,
        longitude: -69.9312,
      },
      cities: [
        {
          name: "Santiago",
          country: "Dominican Republic",
          latitude: 19.4517,
          longitude: -70.697,
        },
      ],
      unit: "celsius",
    };

    await saveConfig(config);

    const stored = JSON.parse(await readFile(CONFIG_PATH, "utf8")) as Config;
    expect(stored).toEqual(config);
  });
});
