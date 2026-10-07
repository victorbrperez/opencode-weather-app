import { afterEach, describe, expect, mock, test } from "bun:test";
import { getDailyForecast, getTemperature } from "../api/weather.ts";
import { searchCities } from "../api/geocoding.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("api", () => {
  test("searchCities maps geocoding results to cities", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            results: [
              {
                name: "Madrid",
                country: "Spain",
                latitude: 40.4168,
                longitude: -3.7038,
              },
              {
                name: "Málaga",
                country: "Spain",
                latitude: 36.7213,
                longitude: -4.4213,
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(searchCities("madrid")).resolves.toEqual([
      {
        name: "Madrid",
        country: "Spain",
        latitude: 40.4168,
        longitude: -3.7038,
      },
      {
        name: "Málaga",
        country: "Spain",
        latitude: 36.7213,
        longitude: -4.4213,
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // expect(true).toBe(false);
  });

  test("searchCities throws when the geocoding request fails", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(new Response("{}", { status: 500 })),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(searchCities("unknown")).rejects.toThrow(
      "Geocoding falló: HTTP 500",
    );
  });

  test("getTemperature returns the current temperature for the selected unit", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            current: { temperature_2m: 23.7 },
          }),
          { status: 200 },
        ),
      ),
    );

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      getTemperature(
        {
          name: "Madrid",
          country: "Spain",
          latitude: 40.4168,
          longitude: -3.7038,
        },
        "celsius",
      ),
    ).resolves.toBe(23.7);
  });

  test("getTemperature throws on HTTP error", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(new Response("{}", { status: 404 })),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      getTemperature(
        {
          name: "Madrid",
          country: "Spain",
          latitude: 40.4168,
          longitude: -3.7038,
        },
        "celsius",
      ),
    ).rejects.toThrow("Forecast falló: HTTP 404");
  });

  test("getDailyForecast maps daily weather data", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            daily: {
              time: ["2026-10-06", "2026-10-07", "2026-10-08"],
              temperature_2m_max: [24, 27, 26],
              temperature_2m_min: [16, 18, 17],
              weather_code: [1, 2, 3],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      getDailyForecast(
        {
          name: "Madrid",
          country: "Spain",
          latitude: 40.4168,
          longitude: -3.7038,
        },
        "celsius",
      ),
    ).resolves.toEqual([
      { date: "2026-10-06", max: 24, min: 16, weatherCode: 1 },
      { date: "2026-10-07", max: 27, min: 18, weatherCode: 2 },
      { date: "2026-10-08", max: 26, min: 17, weatherCode: 3 },
    ]);
  });

  test("getDailyForecast falls back to zero values for missing data", async () => {
    const fetchMock = mock(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            daily: {
              time: ["2026-10-06"],
              temperature_2m_max: [24],
              temperature_2m_min: [],
              weather_code: [],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      getDailyForecast(
        {
          name: "Madrid",
          country: "Spain",
          latitude: 40.4168,
          longitude: -3.7038,
        },
        "celsius",
      ),
    ).resolves.toEqual([
      { date: "2026-10-06", max: 24, min: 0, weatherCode: 0 },
    ]);
  });
});
