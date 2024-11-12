import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import backgroundImageSunny from '../assets/sunny.jpeg';
import backgroundImageRainy from '../assets/rain.jpg';
import backgroundImageCloudy from '../assets/cloud1.jpg';
import backgroundImageSnow from '../assets/snow.jpg';
import { useGetWeatherByCoordsQuery } from '../services/weather.service';

const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImageSnow);
  const [textColor, setTextColor] = useState('white'); // Trạng thái cho màu chữ

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

  // Cập nhật ảnh nền và màu chữ dựa trên điều kiện thời tiết
  useEffect(() => {
    if (weatherData) {
      const weatherMain = weatherData.weather[0].main.toLowerCase();
      
      if (weatherMain.includes('rain')) {
        setBackgroundImage(backgroundImageRainy);
        setTextColor('white');
      } else if (weatherMain.includes('cloud')) {
        setBackgroundImage(backgroundImageCloudy);
        setTextColor('white');
      } else if (weatherMain.includes('clear')) {
        setBackgroundImage(backgroundImageSunny);
        setTextColor('white');
      } else if (weatherMain.includes('snow')) {
        setBackgroundImage(backgroundImageSnow);
        setTextColor('black'); // Đặt màu chữ đen khi có tuyết
      } else {
        setBackgroundImage(backgroundImageSunny);
        setTextColor('white');
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
        color: textColor, // Áp dụng màu chữ
      }}
    >
      {children}
    </Box>
  );
};

export default DynamicBackground;
