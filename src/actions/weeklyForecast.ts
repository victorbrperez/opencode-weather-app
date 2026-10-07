import { getDailyForecast } from "../api/weather.ts";
import type { Config } from "../types/Weather.ts";
import { yellow } from "../utils/colors.ts";
import { unitSymbol, weatherCodeLabel } from "../utils/format.ts";
import { withSpinner } from "../utils/spinner.ts";
import { pickCityIndex } from "./addCity.ts";

export async function showWeeklyForecast(config: Config): Promise<void> {
  let city = config.defaultCity;
  if (!city) {
    if (config.cities.length === 0) {
      console.log("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
      return;
    }
    const index = pickCityIndex(config.cities, "Ciudad para el pronóstico: ");
    if (index === -1) return;
    city = config.cities[index] ?? null;
    if (!city) return;
  }

  const forecast = await withSpinner(
    `Consultando pronóstico de ${city.name}...`,
    getDailyForecast(city, config.unit),
  );

  console.log(`${city.name}, ${city.country} — próximos 7 días:`);
  const unit = unitSymbol(config.unit);
  for (const day of forecast) {
    const max = yellow(`${day.max}${unit}`);
    const min = yellow(`${day.min}${unit}`);
    console.log(`  ${day.date}  max ${max}  min ${min}  ${weatherCodeLabel(day.weatherCode)}`);
  }
}
