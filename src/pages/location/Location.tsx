import {
    Box,
    Grid,
    Typography,
    Button,
    CircularProgress,
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import WeatherInfoForUser from './WeatherInfoForUser';
  import { fetchWeatherData, fetchWeatherDataByCityId, fetchFiveDayForecast } from '../admin/weatherApi';
  import { WeatherData } from '../../interfaces/WeatherType';
  import CitySelector from '../../components/Admin/CitySelector';
  import CityName from './CityName';
  import FiveDayForecast from './FiveDaysWeather';
import { ForecastItem } from '../../interfaces/WeatherType';
import LeftWeather from './LeftWeather';

  const LocationPage: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [locationDenied, setLocationDenied] = useState<boolean>(false);
    const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  
    const getWeatherByCityId = async (cityId: number) => {
      try {
        setLoading(true);
        const data = await fetchWeatherDataByCityId(cityId);
        setWeatherData(data);
        setError(null);
      } catch (error) {
        setError('Không thể lấy dữ liệu thời tiết cho thành phố đã chọn.');
      } finally {
        setLoading(false);
      }
    };
  
    const getWeatherByLocation = async (latitude: number, longitude: number) => {
      try {
        setLoading(true);
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data);
        setError(null);
      } catch (error) {
        setError('Không thể lấy dữ liệu thời tiết.');
      } finally {
        setLoading(false);
      }
    };
  
    const requestLocation = () => {
      setLoading(true);
      setError(null);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            if (error.code === error.PERMISSION_DENIED) {
              setError('Truy cập vị trí bị từ chối. Không thể lấy dữ liệu thời tiết.');
              setLocationDenied(true);
            } else {
              setError('Lỗi khi lấy vị trí.');
            }
            setLoading(false);
          }
        );
      } else {
        setError('Trình duyệt không hỗ trợ định vị địa lý.');
        setLoading(false);
      }
    };

    const fetchForecast = async () => {
      try {
        const latitude = 10.8231; // Thay bằng tọa độ thực tế
        const longitude = 106.6297; // Thay bằng tọa độ thực tế
        const data = await fetchFiveDayForecast(latitude, longitude);
        setForecastData(data.list); // Lưu danh sách dữ liệu dự báo
        setError(null);
      } catch (error) {
        setError('Không thể tải dữ liệu dự báo thời tiết.');
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      requestLocation();
      fetchForecast();
    }, []);
  
    if (loading) {
      return (
        <Box sx={{ padding: 3 , mt: '50px', alignItems:'center', textAlign:'center'}}>
          <CircularProgress />
          <Typography>Đang tải...</Typography>
        </Box>
      );
    }
  
    if (error || !weatherData) {
      return (
        <Box sx={{ padding: 3, marginTop:'50px'}}>
          {error && <Typography color="error">{error}</Typography>}
          {locationDenied ? (
            <>
              <CitySelector onCitySelect={getWeatherByCityId} />
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
        sx={{ padding: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
          <CityName data1={{ id: 0, name: weatherData.name, country: weatherData.sys.country, coord: { lon: 0, lat: 0 } }} />
          <LeftWeather data={weatherData}/>
          </Grid>
          <Grid item xs={12} md={8}>
      <FiveDayForecast forecastData={forecastData} />
          <WeatherInfoForUser data={weatherData}/>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default LocationPage;
  