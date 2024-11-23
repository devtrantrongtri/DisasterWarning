// CitySelector.tsx
import React, { useState } from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import cityListData from '../../assets/city.list.json';
import { City } from '../../interfaces/WeatherType';

interface CitySelectorProps {
  onCitySelect: (city: City) => void;
}

const cityList: City[] = cityListData as City[];

const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect }) => {
  const [cityOptions, setCityOptions] = useState<City[]>([]);

  const handleCityInputChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    if (value.length >= 3) {
      const filteredOptions = cityList.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setCityOptions(filteredOptions.slice(0, 100)); // Limit to 100 results
    } else {
      setCityOptions([]);
    }
  };

  const handleCitySelection = (
    event: React.SyntheticEvent,
    value: City | null
  ) => {
    if (value) {
      onCitySelect(value);
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography>Vui lòng chọn thành phố của bạn:</Typography>
      <Autocomplete
        options={cityOptions}
        getOptionLabel={(option) =>
          `${option.name}, ${option.state ? option.state + ', ' : ''}${option.country}`
        }
        onInputChange={handleCityInputChange}
        onChange={handleCitySelection}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {`${option.name}, ${option.state ? option.state + ', ' : ''}${option.country}`}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tên thành phố"
            variant="outlined"
            sx={{ width: '100%', marginTop: 1 }}
          />
        )}
        sx={{ marginBottom: 2 }}
      />
    </Box>
  );
};

export default CitySelector;
