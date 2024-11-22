import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import DangerousLocationsMap from './DangerousMap';

interface LocationData {
  name: string;
  temperature: number;
  coords: [number, number];
  icon: string;
}

const locationData: LocationData[] = [
  { name: 'Hà Nội', temperature: 30, coords: [21.0285, 105.8542], icon: '🌤️' },
  { name: 'Hồ Chí Minh', temperature: 34, coords: [10.8231, 106.6297], icon: '🌞' },
  { name: 'Đà Nẵng', temperature: 28, coords: [16.0471, 108.2068], icon: '⚡' },
  { name: 'Cần Thơ', temperature: 29, coords: [10.0452, 105.7469], icon: '☔' },
];

const DangerousLocations: React.FC = () => {
  return (
    <Card
      sx={{
        minWidth: 308,
        mx: 'auto', 
        mt: 0,
        borderRadius: 4,
        overflow: 'hidden',
        borderColor: 'primary.main',

        background: 'transparent', // No background
        backdropFilter: 'blur(10px)', // Optional: blurred effect on background
        color: '#030302', // Text color
        boxShadow: 'none',
        
      }}
    >
      <CardContent sx={{ 
        backgroundColor: '#f7f9fc', 
        paddingBottom: 0, 
        background: 'transparent', // No background
        backdropFilter: 'blur(10px)', // Optional: blurred effect on background
        color: '#030302', // Text color
        boxShadow: 'none',
        }}>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '##030302', marginBottom: 4 }} // Sử dụng mã màu trực tiếp
      >
        Các khu vực nguy hiểm
      </Typography>


        <Box
          mb={2}
          sx={{
            height: '430px',
            borderRadius: 1,
            overflow: 'hidden',
            boxShadow: 2,
            border: '2px solid #0e66a1',
          }}
        >
          <DangerousLocationsMap />
        </Box>

        <Divider variant="middle" sx={{ mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            color: 'text.secondary',
          }}
        >
          <Typography 
            variant="body1" 
            align='center'
            sx={{ fontWeight: 'bold',color: '#030302' }}>
            Danh sách các khu vực
          </Typography>
        </Box>

        <List disablePadding>
          {locationData.map((location) => (
            <ListItem
              key={location.name}
              disableGutters
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: location.temperature > 30 ? '#ffebee' : '#e3f2fd',
                mb: 1,
                borderRadius: 1,
                padding: 1,
                boxShadow: 1,
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h5" sx={{ marginRight: 1 }}>
                  {location.icon}
                </Typography>
                <ListItemText
                  primary={location.name}
                  primaryTypographyProps={{ fontWeight: 'medium', color: 'text.primary' }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: location.temperature > 30 ? 'error.main' : 'primary.main',
                }}
              >
                {location.temperature}°C
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DangerousLocations;
