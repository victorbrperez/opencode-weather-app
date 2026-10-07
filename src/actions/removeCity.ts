import { ask } from "../presentation/input.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/Weather.ts";
import { green } from "../utils/colors.ts";
import { pickCityIndex } from "./addCity.ts";

export async function deleteCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades guardadas.");
    return;
  }
  const index = pickCityIndex(config.cities, "Ciudad a eliminar: ");
  if (index === -1) return;

  const [removed] = config.cities.splice(index, 1);
  if (
    removed &&
    config.defaultCity?.latitude === removed.latitude &&
    config.defaultCity?.longitude === removed.longitude
  ) {
    config.defaultCity = null;
  }
  await saveConfig(config);
  console.log(green(`${removed?.name} eliminada.`));
}
