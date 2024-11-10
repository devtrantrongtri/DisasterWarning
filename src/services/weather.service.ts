import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherData } from '../interfaces/WeatherType';


const API_KEY = import.meta.env.VITE_API_WEATHER_KEY;

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
  }),
  endpoints: (builder) => ({
    getWeatherByCoords: builder.query<WeatherData, { lat: number; lon: number }>({
      query: ({ lat, lon }) =>
        `weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    }),
    getWeatherByCityId: builder.query<WeatherData, number>({
      query: (cityId) =>
        `weather?id=${cityId}&appid=${API_KEY}&units=metric`,
    }),
  }),
});

export const {
  useGetWeatherByCoordsQuery,
  useGetWeatherByCityIdQuery,
} = weatherApi;
