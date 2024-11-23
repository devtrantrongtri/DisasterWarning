import { City } from '../../interfaces/WeatherType';
import { Paper, Typography } from '@mui/material';
interface City1{
    data1: City;
  }
const CityName: React.FC<City1> = ({ data1 }) => {  
  
  return (
    <Paper elevation={7} sx={{ padding: 2, backgroundColor: '#e0f7fa', borderRadius: 2 , mt:'50px',
         maxWidth: '20vw', 
        position: 'relative',
        ml: '4vw', minHeight: '30vw',

        }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
      {data1.name}, {data1.country}</Typography>

      

    </Paper>
  );
};

export default CityName;