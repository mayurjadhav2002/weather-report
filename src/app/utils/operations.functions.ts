import { WeatherCode } from "../types/main.types";


export const weatherCodes: Record<
  WeatherCode,
  { description: string; image: string }
> = {
  0: { description: 'Clear sky', image: './SVG/day_clear.svg' },
  1: { description: 'Mainly clear', image: './SVG/day_clear.svg' },
  2: { description: 'Partly cloudy', image: './SVG/day_partial_cloud.svg' },
  3: { description: 'Overcast', image: './SVG/day_partial_cloud.svg' },
  45: { description: 'Fog', image: './SVG/fog.svg' },
  51: { description: 'Drizzle', image: './SVG/day_partial_cloud.svg' },
  61: { description: 'Rain', image: './SVG/day_partial_cloud.svg'},
  71: { description: 'Snowfall', image: './SVG/day_snow.svg'},
};
export function getWeatherDescriptionAndImage(code: WeatherCode) {
  return (
    weatherCodes[code] || {
      description: 'Clear Sky',
      image: './SVG/day_clear.svg',
    }
  );
}

export function calculateFeelsLike(
  temperature: number,
  windspeed: number,
  humidity: number = 50
): number {
  if (temperature < 10) {
    const feelsLike =
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windspeed, 0.16) +
      0.3965 * temperature * Math.pow(windspeed, 0.16);
    return Math.round(feelsLike);
  } else if (temperature > 25) {
    const feelsLike = temperature + 0.33 * humidity - 0.7 * windspeed - 4;
    return Math.round(feelsLike);
  }

  return temperature;
}
