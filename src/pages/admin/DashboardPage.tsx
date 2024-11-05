import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import UserInfo from '../../components/Admin/UserInfo';
import WeatherInfo from '../../components/Admin/WeatherInfo';
import CitySelector from '../../components/Admin/CitySelector';

import { WeatherData } from '../../interfaces/WeatherType';
import { useGetWeatherByCityIdQuery, useGetWeatherByCoordsQuery } from '../../services/weather.service';

const DashboardPage: React.FC = () => {
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  // Sử dụng RTK Query hooks để fetch dữ liệu
  const {
    data: weatherDataByCoords,
    error: errorByCoords,
    isLoading: loadingByCoords,
  } = useGetWeatherByCoordsQuery(coords!, { skip: !coords });

  const {
    data: weatherDataByCityId,
    error: errorByCityId,
    isLoading: loadingByCityId,
  } = useGetWeatherByCityIdQuery(cityId!, { skip: !cityId });

  const isLoading = loadingByCoords || loadingByCityId;
  const error = errorByCoords || errorByCityId;
  const weatherData = weatherDataByCoords || weatherDataByCityId;

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          setLocationDenied(false);
          setCityId(null); // Đặt lại cityId để tránh xung đột khi fetch
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationDenied(true);
          }
        }
      );
    } else {
      console.error('Trình duyệt không hỗ trợ định vị địa lý.');
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleCitySelect = (selectedCityId: number) => {
    setCityId(selectedCityId);
    setCoords(null); // Đặt lại coords để tránh xung đột khi fetch
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 3 }}>
        <CircularProgress />
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Box sx={{ padding: 3 }}>
        {error && (
          <Typography color="error">Không thể lấy dữ liệu thời tiết.</Typography>
        )}
        {locationDenied ? (
          <>
            <CitySelector onCitySelect={handleCitySelect} />
            <Typography sx={{ marginTop: 2 }}>
              Hoặc bạn có thể thử cho phép truy cập vị trí một lần nữa:
            </Typography>
            <Button
              variant="contained"
              onClick={requestLocation}
              sx={{ marginTop: 1 }}
            >
              Yêu cầu truy cập vị trí
            </Button>
          </>
        ) : (
          <Box sx={{ marginTop: 2 }}>
            <Typography>Không thể lấy dữ liệu thời tiết.</Typography>
            <Button
              variant="contained"
              onClick={requestLocation}
              sx={{ marginTop: 1 }}
            >
              Thử lại
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={3}>
          <UserInfo />
        </Grid>
        <Grid item xs={12} md={8}>
          <WeatherInfo data={weatherData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
