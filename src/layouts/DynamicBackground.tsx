import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import backgroundImageSunny from '../assets/sunny.jpeg';
import backgroundImageRainy from '../assets/rain.jpg';
import backgroundImageCloudy from '../assets/cloud1.jpg';
import backgroundImageSnow from '../assets/snow1.jpg';
import { useGetWeatherByCoordsQuery } from '../services/weather.service';
import { RootState } from '../interfaces/StoreTypes';
import { setType } from '../stores/slices/weather.slice';

const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const dispatch = useDispatch();

  // Lấy typeWeather từ Redux store
  const typeWeather = useSelector((state: RootState) => state.weather.typeWeather);

  // Xác định ảnh nền dựa trên typeWeather
  const [backgroundImage, setBackgroundImage] = useState(backgroundImageSunny);

  useEffect(() => {
    // Cập nhật ảnh nền khi typeWeather thay đổi
    const backgroundMapping:any = {
      sunny: backgroundImageSunny,
      rain: backgroundImageRainy,
      cloudy: backgroundImageCloudy,
      snow: backgroundImageSnow,
    };

    setBackgroundImage(backgroundMapping[typeWeather] || backgroundImageSunny);
    console.log('DynamicBackground updated:', typeWeather, backgroundMapping[typeWeather]);
  }, [typeWeather]);

  // Lấy tọa độ hiện tại của người dùng
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => console.error('Lỗi lấy tọa độ:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Gọi API thời tiết với RTK Query
  const { data: weatherData } = useGetWeatherByCoordsQuery(coords!, { skip: !coords });

  // Cập nhật typeWeather vào Redux store khi nhận dữ liệu mới
  useEffect(() => {
    if (weatherData) {
      const weatherMain = weatherData.weather[0].main.toLowerCase();
      if (weatherMain.includes('rain')) {
        dispatch(setType('rain'));
      } else if (weatherMain.includes('clouds')) {
        dispatch(setType('cloudy'));
      } else if (weatherMain.includes('clear')) {
        dispatch(setType('sunny'));
      } else if (weatherMain.includes('snow')) {
        dispatch(setType('snowy'));
      } else {
        dispatch(setType('sunny')); // Mặc định là sunny
      }
    }
  }, [weatherData, dispatch]);

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
