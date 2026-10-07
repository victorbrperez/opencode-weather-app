import type { City } from "../types/City.ts";

interface GeocodingResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
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
