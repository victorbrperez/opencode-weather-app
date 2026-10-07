import { getTemperature } from "../api/weather.ts";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Weather.ts";
import { yellow } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import { withSpinner } from "../utils/spinner.ts";

export async function showCityWeather(city: City, config: Config): Promise<void> {
  const temperature = await withSpinner(
    `Consultando ${city.name}...`,
    getTemperature(city, config.unit),
  );
  console.log(`${city.name}, ${city.country}: ${yellow(`${temperature}${unitSymbol(config.unit)}`)}`);
}

export async function showDefaultCityWeather(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("No hay ciudad default. Usa la opción 5 para establecer una.");
    return;
  }
  await showCityWeather(config.defaultCity, config);
}

export async function showAllCitiesWeather(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    await showCityWeather(city, config);
  }
}
