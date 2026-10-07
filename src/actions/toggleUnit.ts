import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/Weather.ts";
import { green } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";

export async function toggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveConfig(config);
  console.log(green(`Unidad cambiada a ${unitSymbol(config.unit)}.`));
}
