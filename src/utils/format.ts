import type { TemperatureUnit } from "../types/Weather.ts";

export function unitSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

// Códigos WMO de Open-Meteo: https://open-meteo.com/en/docs
export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Despejado";
  if (code <= 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code <= 48) return "Niebla";
  if (code <= 57) return "Llovizna";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  if (code <= 86) return "Chubascos de nieve";
  return "Tormenta";
}
