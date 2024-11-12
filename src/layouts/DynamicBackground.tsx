import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import backgroundImageSunny from '../assets/sunny.jpeg';
import backgroundImageRainy from '../assets/rain.jpg';
import backgroundImageCloudy from '../assets/clouds.jpeg';
import backgroundImageSnow from '../assets/snow.jpeg';
import { useGetWeatherByCoordsQuery } from '../services/weather.service';

const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImageSunny);

  // Lấy tọa độ hiện tại của người dùng
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => console.error("Lỗi lấy tọa độ:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Gọi API thời tiết với hook
  const { data: weatherData } = useGetWeatherByCoordsQuery(coords!, { skip: !coords });

  // Cập nhật ảnh nền dựa trên điều kiện thời tiết
  useEffect(() => {
    if (weatherData) {
      const weatherMain = weatherData.weather[0].main.toLowerCase();
      
      if (weatherMain.includes('rain')) {
        setBackgroundImage(backgroundImageRainy);
      } else if (weatherMain.includes('cloud')) {
        setBackgroundImage(backgroundImageCloudy);
      } else if (weatherMain.includes('clear')) {
        setBackgroundImage(backgroundImageSunny);
      } else if (weatherMain.includes('snow')) {
        setBackgroundImage(backgroundImageSnow);
      } else {
        setBackgroundImage(backgroundImageSunny);
      }
    }
  }, [weatherData]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default DynamicBackground;
