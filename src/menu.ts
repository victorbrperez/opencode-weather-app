import type { MenuAction } from "./actions.ts";
import { cyan } from "./colors.ts";
import type { Config } from "./types.ts";

const LINE = "═".repeat(40);

export function renderMenu(config: Config, actions: MenuAction[]): void {
  console.log(cyan(LINE));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(LINE));
  for (const action of actions) {
    console.log(cyan(`  ${action.key}. ${action.label(config)}`));
  }
  console.log(cyan(LINE));
}

export function ask(message: string): string {
  return (prompt(message) ?? "").trim();
}

export function pause(): void {
  prompt("\nPresiona Enter para continuar...");
}
