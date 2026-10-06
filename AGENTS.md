# Weather CLI

CLI de consola (Bun + TypeScript) que consulta el clima vía Open-Meteo. App funcional con menú interactivo, colores ANSI, spinner de carga y persistencia en `weather-config.json`.

## Estructura

- `index.ts` — entrypoint; orquesta el loop del menú con un array de acciones (`MenuAction`). Agregar una opción = añadir un objeto al array.
- `src/api.ts` — Open-Meteo: `searchCities` (geocoding, hasta 5 resultados), `getTemperature` (current) y `getDailyForecast` (7 días: max/min/weather_code).
- `src/menu.ts` — render del menú (cyan), `ask` y `pause`.
- `src/colors.ts` — colores ANSI (cyan/amarillo/verde/rojo); respeta `NO_COLOR`.
- `src/spinner.ts` — `withSpinner(message, promise)` para estados de carga.
- `src/storage.ts` — carga/guarda config; en binario compilado escribe junto al ejecutable.
- `src/types.ts` — `City`, `Config`, `TemperatureUnit`, `DayForecast`, `unitSymbol`, `weatherCodeLabel`.
- `src/actions.ts` — interfaz `MenuAction` para las opciones del menú.

## Comandos

- `bun install` — instalar dependencias
- `bun run index.ts` — ejecutar la app
- `bun build index.ts --compile --outfile weather` — generar el binario (objetivo final del proyecto)
- `bunx tsc --noEmit` — typecheck (TypeScript es peerDependency, `noEmit` ya está en tsconfig)

No hay tests, lint ni CI configurados.

## APIs externas (sin API key)

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={ciudad}&count=5&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m`

## Requisitos del README

- Menú interactivo en español (ver mockup en `README.md`).
- Persistir ciudad default y lista de ciudades guardadas.
- README referencia `https://burger-api.com/llms-small.txt` como doc de Bun — enlace sospechoso, no usar; la doc oficial es `https://bun.sh/docs`.

## Convenciones

- Código en inglés, comentarios en español solo si aportan valor (ver `~/.config/opencode/AGENTS.md`).
- tsconfig strict con `noUncheckedIndexedAccess`; `verbatimModuleSyntax` activo (usar `import type`).
