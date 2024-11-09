import { Grid,Box, Paper, Typography } from '@mui/material';
import { WeatherData} from '../../interfaces/WeatherType';

interface WeatherInfoProps {
  data: WeatherData;
}

const translationMap: { [key: string]: string } = {
    Clear: 'Trời quang',
    Clouds: 'Có mây',
    Rain: 'Mưa',
    Drizzle: 'Mưa phùn',
    Thunderstorm: 'Giông bão',
    Snow: 'Tuyết',
    Mist: 'Sương mù',
    Smoke: 'Khói',
    Haze: 'Mù',
    Dust: 'Bụi',
    Fog: 'Sương mù',
    Sand: 'Cát',
    Ash: 'Tro bụi',
    Squall: 'Gió mạnh',
    Tornado: 'Lốc xoáy'
  };

  const WeatherInfoForUser: React.FC<WeatherInfoProps> = ({ data }) => {  
  
  return (
    <Paper elevation={7} sx={{ padding: 4, background: 'none', border: 'none', boxShadow: 'none', 
         maxWidth: '105vw', 
        position: 'relative',
        maxHeight:'40vh',
        left: '50%', transform: 'translateX(-60%) translateY(-110%)'}}>

      {/* <Box sx={{ alignItems: 'center', textAlign:'center', transform: 'translateX(-74%)'}}>
        <Box component="img" src={weatherIconUrl} alt="weather icon" sx={{ width: 150, height: 150 }} />
        <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Thời tiết ngày {new Date().toLocaleDateString('Vie', { month: 'long', day: 'numeric', year:'numeric' })} 
      </Typography>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
            {data.main.temp}°C
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                {translationMap[data.weather[0].main] || data.weather[0].main} - {data.weather[0].description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cảm giác như {data.main.feels_like}°C
          </Typography>
        </Box>
      </Box> */}
    <Box>
      <Grid container spacing={3} justifyContent="center" alignItems="center" ml='1vw'>
      <Grid item xs={12} sm={4} md={4}  textAlign="center" >
        <Box border="1px solid black" borderRadius='20px' paddingBottom='4vh' paddingTop='4vh' width='15vw'>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>{data.main.temp_min}°C</Typography>
              <Typography variant="body2">Thấp nhất</Typography>
        </Box>


        </Grid>
        <Grid item xs={12} sm={4} md={4} textAlign="center">
        <Box border="1px solid black" borderRadius='20px' paddingBottom='4vh' paddingTop='4vh' width='15vw' >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5722' }}>{data.main.temp_max}°C</Typography>
              <Typography variant="body2">Cao nhất</Typography>
        </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} textAlign="center">
        <Box border="1px solid black" borderRadius='20px' paddingBottom='4vh' paddingTop='4vh' width='15vw'>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>{data.main.humidity}%</Typography>
          <Typography variant="body2">Độ ẩm</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center" alignItems="center" ml='1vw' mt='0.1vw'>
      <Grid item xs={12} sm={6} md={6}  textAlign="center" >
        <Box border="1px solid black" borderRadius='20px' paddingBottom='4vh' paddingTop='4vh' width='25vw'>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e91e63' }}>{data.wind.speed} m/s</Typography>
          <Typography variant="body2">Tốc độ gió</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={6}  textAlign="center" >
        <Box border="1px solid black" borderRadius='20px' paddingBottom='4vh' paddingTop='4vh' width='25vw'>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>{data.main.pressure} hPa</Typography>
          <Typography variant="body2">Áp suất</Typography>
        </Box>
      </Grid>

    </Grid>
      
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, fontStyle: 'italic', textAlign: 'center' }}>
        Dữ liệu được lấy từ OpenWeather
      </Typography>
      </Box>
    </Paper>
  );
};



export default WeatherInfoForUser;