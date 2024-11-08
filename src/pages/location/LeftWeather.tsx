import {Box, Paper, Typography } from '@mui/material';
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

  const LeftWeather: React.FC<WeatherInfoProps> = ({ data }) => {  
    const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  return (
    <Paper sx={{ padding: 4, background: 'none', border: 'none', boxShadow: 'none' ,
        transform: 'translateY(-110%)',
         maxWidth: '105vw', 
        position: 'relative',
        maxHeight:'80vh',
        ml:'-8vh',
        }}>

      <Box sx={{ alignItems: 'center', textAlign:'center'}}>
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
      </Box>
    </Paper>
  );
};



export default LeftWeather;