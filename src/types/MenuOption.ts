import type { Config } from "./Weather.ts";

export interface MenuOption {
  key: string;
  label: (config: Config) => string;
  run: (config: Config) => Promise<void>;
}
