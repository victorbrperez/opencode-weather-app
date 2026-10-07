import type { City } from "./City.ts";

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface Config {
  defaultCity: City | null;
  cities: City[];
  unit: TemperatureUnit;
}

export interface DayForecast {
  date: string;
  max: number;
  min: number;
  weatherCode: number;
}
