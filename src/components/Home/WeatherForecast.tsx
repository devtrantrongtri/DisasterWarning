import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

interface WeatherForecastProps {
  location: string;
  weatherIconUrl: string;
  forecast: string;
  humidity: string;
  windSpeed: string;
  temperature: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ location, weatherIconUrl, forecast, humidity, windSpeed, temperature }) => {
  return (
    <Box sx={{ margin: 10, padding: 5, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      {/* Phần địa điểm */}
      <Typography variant="h3" gutterBottom>
        {location}
      </Typography>
      <Button variant="outlined" sx={{ mb: 2 ,fontSize: '2.2rem'}}>Địa điểm</Button>

      {/* Phần dự báo thời tiết với tỷ lệ 4/6 và đường kẻ chia */}
      <Grid container spacing={2} alignItems="center">
        {/* Icon thời tiết (4 phần) */}
        <Grid item xs={4}>
          <Box
            component="img"
            src={weatherIconUrl}
            alt="Weather Icon"
            sx={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Grid>

        {/* Chi tiết dự báo thời tiết (6 phần), căn giữa văn bản */}
        <Grid item xs={6} container direction="column" justifyContent="center" alignItems="center">
          <Box>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '3.2rem' }}>
              {forecast}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Độ ẩm: {humidity}</Typography>
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Sức gió: {windSpeed}</Typography>
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Nhiệt độ: {temperature}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherForecast;
