import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import { useGetUserCountQuery, useGetAlertCountQuery } from '../../services/dashboard.service';
import UserInfo from '../../components/Admin/UserInfo';
import WeatherInfo from '../../components/Admin/WeatherInfo';
import CitySelector from '../../components/Admin/CitySelector';
import DisasterChart from '../../components/Admin/DisasterChart';
import AffectedProvincesTable from '../../components/Admin/AffectedProvincesTable';
import { City } from '../../interfaces/WeatherType';
import { useGetWeatherByCityIdQuery, useGetWeatherByCoordsQuery } from '../../services/weather.service';
import DangerousLocations from '../../components/Admin/DangerousLocations';

const DashboardPage: React.FC = () => {
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  const { data: weatherDataByCoords, isLoading: loadingByCoords } = useGetWeatherByCoordsQuery(coords!, { skip: !coords });
  const { data: weatherDataByCityId, isLoading: loadingByCityId } = useGetWeatherByCityIdQuery(cityId!, { skip: !cityId });
  const { data: userCount, isLoading: userLoading } = useGetUserCountQuery();
  const { data: alertCount, isLoading: alertLoading } = useGetAlertCountQuery();
  const isLoading = loadingByCoords || loadingByCityId || userLoading || alertLoading;
  const weatherData = weatherDataByCoords || weatherDataByCityId;

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          setLocationDenied(false);
          setCityId(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationDenied(true);
          }
        }
      );
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleCitySelect = (city: City) => {
    setCityId(city.id);
    setCoords(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 3 }}>
        <CircularProgress />
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (!weatherData) {
    return (
      <Box>
        {locationDenied ? (
          <CitySelector onCitySelect={handleCitySelect} />
        ) : (
          <Button variant="contained" onClick={requestLocation} sx={{ marginTop: 1 }}>
            Thử lại
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={10} justifyContent="center">
      {/* UserInfo và WeatherInfo */}
      <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 0 }}>
        <Box
          sx={{
            padding: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            boxShadow: 3,
            marginLeft:"40px",
            marginTop:-9,
          }}
        >
          <UserInfo />
        </Box>
        <Box
          sx={{
            minWidth: '64%',
            padding: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            boxShadow: 3,
            marginTop:-9,
          }}
        >
          <WeatherInfo data={weatherData} />
        </Box>
      </Grid>

      {/* DisasterChart và AffectedProvincesTable */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            padding: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <DisasterChart />
        </Box>
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <AffectedProvincesTable />
        </Box>
      </Grid>

      {/* DangerousLocations */}
      <Grid item xs={12} md={3}>
        <Box
          sx={{
            padding: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            boxShadow: 3,
            width:"346px",
          }}
        >
          <DangerousLocations />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
