import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CitySelector from './CitySelector';
import { addProvince, deleteProvince, getProvinces } from '../../pages/admin/indexDB';
import { City } from '../../interfaces/WeatherType';
import { useLazyGetWeatherByCityIdQuery } from '../../services/weather.service';

interface ProvinceData {
  id: number;
  name: string;
  disasterType: string;
  date: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  weatherMain: string;
  weatherDescription: string;
  country: string;
}

const AffectedProvincesTable: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [provinceDataList, setProvinceDataList] = useState<ProvinceData[]>([]);

  // Sử dụng useLazyQuery để gọi API theo yêu cầu
  const [triggerGetWeather, { data: weatherData }] = useLazyGetWeatherByCityIdQuery ();

  useEffect(() => {
    // Lấy dữ liệu từ IndexedDB khi component được load
    const fetchData = async () => {
      const storedProvinces = await getProvinces();
      setProvinceDataList(storedProvinces);
    };
    fetchData();
  }, []);

  const handleCitySelect = (city: City) => {
    const cityId = city.id;
    // Kiểm tra xem tỉnh này đã tồn tại trong bảng hay chưa
    const exists = provinceDataList.some((province) => province.id === cityId);
    if (!exists) {
      setSelectedCityId(cityId);
    } else {
      // Nếu tỉnh đã tồn tại, có thể thông báo cho người dùng biết
    }
  };

  const handleGetWeather = () => {
    if (selectedCityId) {
      // Kiểm tra xem tỉnh này đã tồn tại trong bảng hay chưa
      const exists = provinceDataList.some((province) => province.id === selectedCityId);
      if (!exists) {
        triggerGetWeather(selectedCityId);
      } else {
        // Nếu tỉnh đã tồn tại, có thể thông báo cho người dùng biết
      }
    }
  };

  useEffect(() => {
    if (weatherData && selectedCityId) {
      // Kiểm tra lần nữa để đảm bảo tỉnh chưa tồn tại trong bảng trước khi thêm
      const exists = provinceDataList.some((province) => province.id === selectedCityId);
      if (!exists) {
        const newEntry: ProvinceData = {
          id: selectedCityId,
          name: weatherData.name,
          disasterType: 'null',
          date: new Date().toISOString().split('T')[0],
          temperature: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          tempMin: weatherData.main.temp_min,
          tempMax: weatherData.main.temp_max,
          pressure: weatherData.main.pressure,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          weatherMain: weatherData.weather[0].main,
          weatherDescription: weatherData.weather[0].description,
          country: weatherData.sys.country,
        };

        // Cập nhật vào bảng và lưu vào IndexedDB
        setProvinceDataList((prev) => [...prev, newEntry]);
        addProvince(newEntry);

        // Đặt lại `selectedCityId` nếu cần
        // setSelectedCityId(null);
      }
    }
  }, [weatherData, selectedCityId, provinceDataList]);

  const handleDelete = async (id: number) => {
    // Xóa dữ liệu khỏi bảng và IndexedDB
    setProvinceDataList((prev) => prev.filter((province) => province.id !== id));
    await deleteProvince(id);
  };

  return (
    <Box sx={{ 
      padding: 3, 
      backgroundColor: '#f9f9f9', 
      borderRadius: 4, 
      background: 'transparent', // No background
      backdropFilter: 'blur(10px)', // Optional: blurred effect on background
      color: '#030302', // Text color
      boxShadow: 'none',
      }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#030302', textAlign: 'center', }}>
        Bảng tra cứu các tỉnh/thành bị ảnh hưởng thiên tai
      </Typography>
      <CitySelector onCitySelect={handleCitySelect} />

      {/* Thêm nút "Lấy thời tiết" */}
      <Button
        variant="contained"
        onClick={handleGetWeather}
        disabled={!selectedCityId}
        sx={{
          marginTop: 2,
          backgroundColor: '#0e66a1', // Thêm màu cho nền button
          '&:hover': {
            backgroundColor: '#fff', // Màu khi hover (nếu cần)
            color: '#0e66a1',
          },
        }}
      >
        Lấy thời tiết
      </Button>


      {/* Thêm overflowX cho Box chứa bảng để có thể cuộn ngang */}
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ 
          marginTop: 2, 
          backgroundColor: '#ffffff', 
          borderRadius: 1, 
          minWidth: '800px',
          background: 'transparent', // No background
          backdropFilter: 'blur(10px)', // Optional: blurred effect on background
          color: '#030302', // Text color
          boxShadow: 'none',
          
          }}>
          <TableHead>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Tỉnh/Thành</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Quốc gia</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Loại thiên tai</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Ngày xảy ra</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Nhiệt độ (°C)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Cảm giác như (°C)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Nhiệt độ thấp nhất (°C)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Nhiệt độ cao nhất (°C)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Áp suất (hPa)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Độ ẩm (%)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Tốc độ gió (m/s)</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Thời tiết</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Mô tả</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#610909', verticalAlign: 'top' }}>Hành động</TableCell>
          </TableHead>
          <TableBody>
            {provinceDataList.length > 0 ? (
              provinceDataList.map((province) => (
                <TableRow key={province.id} 
                sx={{ 
                  marginTop: 2, 
                  backgroundColor: '#ffffff', 
                  borderRadius: 1, 
                  minWidth: '800px',
                  background: 'transparent', // No background
                  backdropFilter: 'blur(10px)', // Optional: blurred effect on background
                  color: '#030302', // Text color
                  boxShadow: 'none',
                  
                  }}>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.name}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.country}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.disasterType}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.date}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.temperature}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.feelsLike}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.tempMin}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.tempMax}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.pressure}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.humidity}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.windSpeed}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.weatherMain}</TableCell>
                  <TableCell sx={{ color: '#012238', verticalAlign: 'center' }}>{province.weatherDescription}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(province.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} sx={{ textAlign: 'center', color: '#888' }}>
                  Chọn tỉnh/thành và bấm "Lấy thời tiết" để hiển thị thông tin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default AffectedProvincesTable;
