import type { Config } from "./types.ts";

export interface MenuAction {
  key: string;
  label: (config: Config) => string;
  run: (config: Config) => Promise<void>;
}
