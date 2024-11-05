import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import cityListData from '../../assets/city.list.json';
import { City } from '../../interfaces/WeatherType';


interface CitySelectorProps {
  onCitySelect: (cityId: number) => void;
}

const cityList: City[] = cityListData as City[];

const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect }) => {
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCityInputChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    if (value.length >= 3) {
      const filteredOptions = cityList.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setCityOptions(filteredOptions.slice(0, 100)); // Giới hạn 100 kết quả
    } else {
      setCityOptions([]);
    }
  };

  const handleCitySelection = (
    event: React.SyntheticEvent,
    value: City | null
  ) => {
    setSelectedCity(value);
  };

  const handleFetchWeatherByCity = () => {
    if (selectedCity) {
      onCitySelect(selectedCity.id);
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography>
        Vui lòng chọn thành phố của bạn để lấy thông tin thời tiết:
      </Typography>
      <Autocomplete
        options={cityOptions}
        getOptionLabel={(option) =>
          `${option.name}, ${option.state ? option.state + ', ' : ''}${option.country}`
        }
        onInputChange={handleCityInputChange}
        onChange={handleCitySelection}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tên thành phố"
            variant="outlined"
            sx={{ width: 300, marginTop: 1 }}
          />
        )}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleFetchWeatherByCity}
        disabled={!selectedCity}
      >
        Lấy thời tiết
      </Button>
    </Box>
  );
};

export default CitySelector;
