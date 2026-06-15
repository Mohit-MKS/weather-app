import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import utilService from './utilService';
import type { WeatherData } from './utilService';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY
  || 'd7b950541d7264a3b3df80a8b6f2cbf7';

const axiosInstance = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 10000,
});

export type WeatherServiceResult =
  | { ok: true; data: WeatherData }
  | { ok: false; error: string };

export const getWeatherByCity = async (
  city: string,
  signal?: AbortSignal,
): Promise<WeatherServiceResult> => {
  const config: AxiosRequestConfig = {
    signal,
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  };

  try {
    const response = await axiosInstance.get<unknown>('', config);
    return { ok: true, data: utilService.formatWeatherData(response.data) };
  } catch (error) {
    if (axios.isCancel(error)) {
      return { ok: false, error: 'Request cancelled.' };
    }

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { ok: false, error: `We could not find weather for "${city}".` };
      }

      if (!error.response) {
        return { ok: false, error: 'Unable to reach the weather service. Check your connection and try again.' };
      }
    }

    const message = error instanceof Error
      ? error.message
      : 'Something went wrong while loading the weather.';

    return { ok: false, error: message };
  }
};

export default axiosInstance;
