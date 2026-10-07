# Weather CLI

Aplicación de consola en Bun + TypeScript para consultar el clima con Open-Meteo.

## Stack

- [Bun.js](https://bun.sh/docs)
- Open-Meteo

## Funcionalidades

- Consultar el clima de la ciudad por defecto.
- Consultar el clima de todas las ciudades guardadas.
- Buscar y guardar ciudades.
- Eliminar ciudades guardadas.
- Establecer una ciudad por defecto.
- Ver pronóstico de 7 días.
- Alternar unidad entre °C y °F.
- Persistencia local en `weather-config.json`.

## Menú

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción:
```

## Comandos

```bash
bun install
bun run src/index.ts
bun build src/index.ts --compile --outfile weather
```

## APIs externas

```text
https://geocoding-api.open-meteo.com/v1/search?name={ciudad}&count=5&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m
```

