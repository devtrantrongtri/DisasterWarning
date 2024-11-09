// components/FiveDayForecast.tsx
import React from 'react';
import { Box, Typography, Card, CardContent, Paper } from '@mui/material';

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface FiveDayForecastProps {
  forecastData: ForecastItem[];
}

const FiveDayForecast: React.FC<FiveDayForecastProps> = ({ forecastData }) => {
  return (
    <Paper elevation={7} sx={{mt: 6, ml: -8, backgroundColor: '#e0f7fa', borderRadius: 2, mr: 16, pl:4, height: 650}}>
    <Typography variant="h5" sx={{fontWeight:'bold', pt:2}}>
        Dự báo thời tiết 5 ngày tới
      </Typography>
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'scroll', mt: 2, mr:4, border: '1px dotted black', borderRadius:'10px'}}>
    {forecastData.map((item, index) => (
        <Card key={index} sx={{ minWidth: 150, padding: 2, alignItems:'center', textAlign:'center' }}>
          <CardContent sx={{p:'0 0'}}>
            <Typography sx={{fontWeight:600}} >{item.dt_txt}</Typography>
            <Typography>{item.main.temp}°C</Typography>
            <Typography sx={{fontStyle:'italic'}}>{item.weather[0].description}</Typography>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
          </CardContent>
        </Card>
      ))}

    </Box>
    </Paper>
  );
};

export default FiveDayForecast;
 