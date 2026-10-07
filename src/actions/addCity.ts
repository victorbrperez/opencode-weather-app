import { searchCities } from "../api/geocoding.ts";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Weather.ts";
import { green } from "../utils/colors.ts";
import { withSpinner } from "../utils/spinner.ts";
import { ask } from "../presentation/input.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import { showCityWeather } from "./getWeather.ts";

function pickCityIndex(cities: City[], message: string): number {
  cities.forEach((city, i) => {
    console.log(`  ${i + 1}. ${city.name}, ${city.country}`);
  });
  const answer = Number(ask(message));
  if (!Number.isInteger(answer) || answer < 1 || answer > cities.length) {
    console.log("Opción inválida.");
    return -1;
  }
  return answer - 1;
}

export async function searchAndAddCity(config: Config): Promise<void> {
  const name = ask("Nombre de la ciudad: ");
  if (!name) return;

  const results = await withSpinner(`Buscando "${name}"...`, searchCities(name));
  if (results.length === 0) {
    console.log(`No se encontró "${name}".`);
    return;
  }

  const city =
    results.length === 1
      ? results[0]
      : results[pickCityIndex(results, "Elige una ciudad: ")];

  if (!city) return;

  console.log(`Encontrada: ${city.name}, ${city.country}`);
  if (ask("¿Agregar a tus ciudades? (s/n): ").toLowerCase() !== "s") return;

  const exists = config.cities.some(
    (c) => c.latitude === city.latitude && c.longitude === city.longitude,
  );
  if (exists) {
    console.log("Esa ciudad ya está guardada.");
    return;
  }

  config.cities.push(city);
  await saveConfig(config);
  console.log(green("Ciudad agregada."));
  await showCityWeather(city, config);
}

export { pickCityIndex };
