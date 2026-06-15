export interface WeatherData {
  city: string;
  country: string;
  description: string;
  iconCode: string;
  temperature: number | null;
  feelsLike: number | null;
  minTemperature: number | null;
  maxTemperature: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
  visibilityKm: number | null;
  sunrise: number | null;
  sunset: number | null;
  timezoneOffset: number;
}

type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord =>
  typeof value === 'object' && value !== null ? value as JsonRecord : {};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

class UtilService {
  formatWeatherData(response: unknown): WeatherData {
    const weatherInfo = asRecord(response);
    const main = asRecord(weatherInfo.main);
    const wind = asRecord(weatherInfo.wind);
    const system = asRecord(weatherInfo.sys);
    const weatherList = Array.isArray(weatherInfo.weather) ? weatherInfo.weather : [];
    const currentWeather = asRecord(weatherList[0]);
    const city = asString(weatherInfo.name).trim();

    if (!city) {
      throw new Error('The weather service returned an unexpected response.');
    }

    const visibility = asNumber(weatherInfo.visibility);

    return {
      city,
      country: asString(system.country),
      description: asString(currentWeather.description, 'Weather details unavailable'),
      iconCode: asString(currentWeather.icon),
      temperature: asNumber(main.temp),
      feelsLike: asNumber(main.feels_like),
      minTemperature: asNumber(main.temp_min),
      maxTemperature: asNumber(main.temp_max),
      humidity: asNumber(main.humidity),
      pressure: asNumber(main.pressure),
      windSpeed: asNumber(wind.speed),
      visibilityKm: visibility === null ? null : visibility / 1000,
      sunrise: asNumber(system.sunrise),
      sunset: asNumber(system.sunset),
      timezoneOffset: asNumber(weatherInfo.timezone) ?? 0,
    };
  }
}

export default new UtilService();
