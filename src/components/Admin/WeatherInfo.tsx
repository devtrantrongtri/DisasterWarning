import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

interface WeatherData {
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherInfoProps {
  data: WeatherData;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data }) => {
  const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#e0f7fa', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - Weather Report
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box component="img" src={weatherIconUrl} alt="weather icon" sx={{ width: 80, height: 80 }} />
        <Box>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
            {data.main.temp}°C
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            {data.weather[0].main} - {data.weather[0].description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Feels like {data.main.feels_like}°C
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 3, textAlign: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>{data.main.temp_min}°C</Typography>
          <Typography variant="body2">Min Temp</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5722' }}>{data.main.temp_max}°C</Typography>
          <Typography variant="body2">Max Temp</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>{data.main.humidity}%</Typography>
          <Typography variant="body2">Humidity</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e91e63' }}>{data.wind.speed} m/s</Typography>
          <Typography variant="body2">Wind Speed</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>{data.main.pressure} hPa</Typography>
          <Typography variant="body2">Pressure</Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, fontStyle: 'italic', textAlign: 'center' }}>
        Excellent time for planting root crops that can be planted now and for...
      </Typography>
    </Paper>
  );
};

export default WeatherInfo;
