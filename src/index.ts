import type { MenuOption } from "./types/MenuOption.ts";
import { searchAndAddCity } from "./actions/addCity.ts";
import { showDefaultCityWeather, showAllCitiesWeather } from "./actions/getWeather.ts";
import { deleteCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { showWeeklyForecast } from "./actions/weeklyForecast.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";
import { ask, pause } from "./presentation/input.ts";
import { renderMenu } from "./presentation/menu.ts";
import { loadConfig } from "./storage/settingsStorage.ts";
import { unitSymbol } from "./utils/format.ts";
import { red } from "./utils/colors.ts";

const actions: MenuOption[] = [
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
