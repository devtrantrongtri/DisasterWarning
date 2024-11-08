import axios from 'axios';
import { WeatherData } from '../../interfaces/WeatherType';

export const fetchWeatherDataByCityId = async (cityId: number): Promise<WeatherData | null> => {
  try {
    const API_KEY = import.meta.env.VITE_API_WEATHER_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=vi`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data by city ID:', error);
    throw error;
  }
};

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData | null> => {
  try {
    const API_KEY = import.meta.env.VITE_API_WEATHER_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=vi`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchFiveDayForecast = async (latitude: number, longitude: number) => {
  try {
    const API_KEY = import.meta.env.VITE_API_WEATHER_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=vi`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching 5-day forecast:', error);
    throw error;
  }
};
