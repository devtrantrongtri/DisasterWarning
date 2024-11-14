const API_KEY = '3e1141883f7b46f9986103021241011';
  
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
  
      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null; // Trả về null nếu có lỗi
    }
};

export const onSearch = async (city: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=6`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface WeatherData {
    location: {
      name: string;
      country: string;
      region: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime: string;
    };
    current: {
      temp_c: number;
      feelslike_c: number;
      condition: {
        text: string;
        icon: string;
      };
      wind_kph: number;
      wind_dir: string;
      humidity: number;
      vis_km: number;
      pressure_mb: number;
      air_quality?: {
        co: number;
        no2: number;
        o3: number;
        pm2_5: number;
      };
      last_updated: string;
    };
    forecast: {
      forecastday: Array<{
        date: string;
        day: {
          maxtemp_c: number;
          mintemp_c: number;
          condition: {
            text: string;
            icon: string;
          };
        };
        hour?: Array<{
          time: string;
          temp_c: number;
          condition: {
            text: string;
            icon: string;
          };
        }> ;
      }> ;
    };
}