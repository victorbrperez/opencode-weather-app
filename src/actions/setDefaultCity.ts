import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/Weather.ts";
import { green } from "../utils/colors.ts";
import { pickCityIndex } from "./addCity.ts";

export async function setDefaultCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  const index = pickCityIndex(config.cities, "Ciudad default: ");
  if (index === -1) return;

  config.defaultCity = config.cities[index] ?? null;
  await saveConfig(config);
  console.log(green(`Ciudad default: ${config.defaultCity?.name}.`));
}
