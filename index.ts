import { searchCities, getDailyForecast, getTemperature } from "./src/api.ts";
import type { MenuAction } from "./src/actions.ts";
import { green, red, yellow } from "./src/colors.ts";
import { ask, pause, renderMenu } from "./src/menu.ts";
import { withSpinner } from "./src/spinner.ts";
import { loadConfig, saveConfig } from "./src/storage.ts";
import type { City, Config } from "./src/types.ts";
import { unitSymbol, weatherCodeLabel } from "./src/types.ts";

async function showCityWeather(city: City, config: Config): Promise<void> {
  const temperature = await withSpinner(
    `Consultando ${city.name}...`,
    getTemperature(city, config.unit),
  );
  console.log(`${city.name}, ${city.country}: ${yellow(`${temperature}${unitSymbol(config.unit)}`)}`);
}

async function showDefaultCityWeather(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("No hay ciudad default. Usa la opción 5 para establecer una.");
    return;
  }
  await showCityWeather(config.defaultCity, config);
}

async function showAllCitiesWeather(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    await showCityWeather(city, config);
  }
}

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

async function searchAndAddCity(config: Config): Promise<void> {
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

async function deleteCity(config: Config): Promise<void> {
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

async function setDefaultCity(config: Config): Promise<void> {
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

async function toggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveConfig(config);
  console.log(green(`Unidad cambiada a ${unitSymbol(config.unit)}.`));
}

async function showWeeklyForecast(config: Config): Promise<void> {
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

const actions: MenuAction[] = [
  { key: "1", label: () => "Clima de ciudad default", run: showDefaultCityWeather },
  { key: "2", label: (c) => `Clima de todas las ciudades (${c.cities.length})`, run: showAllCitiesWeather },
  { key: "3", label: () => "Buscar y agregar ciudad", run: searchAndAddCity },
  { key: "4", label: () => "Eliminar ciudad", run: deleteCity },
  { key: "5", label: () => "Establecer ciudad default", run: setDefaultCity },
  { key: "6", label: () => "Pronóstico 7 días", run: showWeeklyForecast },
  { key: "8", label: (c) => `Ajustes (${unitSymbol(c.unit)})`, run: toggleUnit },
  { key: "9", label: () => "Salir", run: async () => {} },
];

async function main(): Promise<void> {
  const config = await loadConfig();

  for (;;) {
    console.clear();
    renderMenu(config, actions);
    const option = ask("  Selecciona una opción: ");
    console.log();

    if (option === "9") {
      console.log("¡Hasta luego!");
      return;
    }

    const action = actions.find((a) => a.key === option);
    try {
      if (!action) {
        console.log("Opción inválida.");
      } else {
        await action.run(config);
      }
    } catch (error) {
      console.log(red(`Error: ${error instanceof Error ? error.message : error}`));
    }

    pause();
  }
}

await main();
