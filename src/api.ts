import type { City, DayForecast, TemperatureUnit } from "./types.ts";

interface GeocodingResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

interface ForecastResponse {
  current: {
    temperature_2m: number;
  };
}

interface DailyForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export async function searchCities(name: string): Promise<City[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=es&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geocoding falló: HTTP ${response.status}`);

  const data = (await response.json()) as GeocodingResponse;
  return (data.results ?? []).map((result) => ({
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

export async function getTemperature(
  city: City,
  unit: TemperatureUnit,
): Promise<number> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${unit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast falló: HTTP ${response.status}`);

  const data = (await response.json()) as ForecastResponse;
  return data.current.temperature_2m;
}

export async function getDailyForecast(
  city: City,
  unit: TemperatureUnit,
): Promise<DayForecast[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7&temperature_unit=${unit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast falló: HTTP ${response.status}`);

  const data = (await response.json()) as DailyForecastResponse;
  return data.daily.time.map((date, i) => ({
    date,
    max: data.daily.temperature_2m_max[i] ?? 0,
    min: data.daily.temperature_2m_min[i] ?? 0,
    weatherCode: data.daily.weather_code[i] ?? 0,
  }));
}
