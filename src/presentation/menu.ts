import type { MenuOption } from "../types/MenuOption.ts";
import type { Config } from "../types/Weather.ts";
import { cyan } from "../utils/colors.ts";

const LINE = "═".repeat(40);

export function renderMenu(config: Config, actions: MenuOption[]): void {
  console.log(cyan(LINE));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(LINE));
  for (const action of actions) {
    console.log(cyan(`  ${action.key}. ${action.label(config)}`));
  }
  console.log(cyan(LINE));
}
