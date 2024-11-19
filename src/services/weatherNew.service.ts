import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherData, WeatherRequestParams } from "../interfaces/WeatherNewType";

const API_KEY = import.meta.env.VITE_API_WEATHER_NEW_KEY;

export const weatherNewApi = createApi({
    reducerPath: 'weatherNewApi',
    baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.weatherapi.com/v1',
    }),
    endpoints: (builder) => ({
      getWeatherByLocation: builder.query<WeatherData, { lat: number; lon: number }>({
        query: ({ lat, lon }) => `forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6`,
      }),
      getWeatherByParams: builder.query<WeatherData, WeatherRequestParams >({
        query: (params) => {
          const queryString = new URLSearchParams(
            Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {})
          ).toString();
          return `forecast.json?key=${API_KEY}&${queryString}`;
        },
      }),
    }),
  });
  
  export const { useGetWeatherByLocationQuery, useGetWeatherByParamsQuery } = weatherNewApi;
