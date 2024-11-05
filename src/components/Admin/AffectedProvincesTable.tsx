import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CitySelector from './CitySelector';
import { useGetWeatherByCityIdQuery } from '../../services/weather.service';
import { addProvince, deleteProvince, getProvinces } from '../../pages/admin/indexDB';

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

  const { data: weatherData } = useGetWeatherByCityIdQuery(selectedCityId!, { skip: !selectedCityId });

  useEffect(() => {
    // Lấy dữ liệu từ IndexedDB khi component được load
    const fetchData = async () => {
      const storedProvinces = await getProvinces();
      setProvinceDataList(storedProvinces);
    };
    fetchData();
  }, []);

  const handleCitySelect = (cityId: number) => {
    // Kiểm tra xem tỉnh này đã tồn tại trong bảng hay chưa
    const exists = provinceDataList.some((province) => province.id === cityId);
    if (!exists) {
      setSelectedCityId(cityId);
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
          disasterType: 'Lũ lụt', // Dữ liệu mẫu, có thể thay đổi theo yêu cầu thực tế
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

        // Đặt lại `selectedCityId` để tránh lặp lại việc thêm dữ liệu
        setSelectedCityId(null);
      }
    }
  }, [weatherData, selectedCityId, provinceDataList]);

  const handleDelete = async (id: number) => {
    // Xóa dữ liệu khỏi bảng và IndexedDB
    setProvinceDataList((prev) => prev.filter((province) => province.id !== id));
    await deleteProvince(id);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Bảng các tỉnh/thành bị ảnh hưởng thiên tai gần đây nhất
      </Typography>
      <CitySelector onCitySelect={handleCitySelect} />

      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tỉnh/Thành</TableCell>
            <TableCell>Quốc gia</TableCell>
            <TableCell>Loại thiên tai</TableCell>
            <TableCell>Ngày xảy ra</TableCell>
            <TableCell>Nhiệt độ (°C)</TableCell>
            <TableCell>Cảm giác như (°C)</TableCell>
            <TableCell>Nhiệt độ thấp nhất (°C)</TableCell>
            <TableCell>Nhiệt độ cao nhất (°C)</TableCell>
            <TableCell>Áp suất (hPa)</TableCell>
            <TableCell>Độ ẩm (%)</TableCell>
            <TableCell>Tốc độ gió (m/s)</TableCell>
            <TableCell>Thời tiết</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {provinceDataList.length > 0 ? (
            provinceDataList.map((province) => (
              <TableRow key={province.id}>
                <TableCell>{province.name}</TableCell>
                <TableCell>{province.country}</TableCell>
                <TableCell>{province.disasterType}</TableCell>
                <TableCell>{province.date}</TableCell>
                <TableCell>{province.temperature}</TableCell>
                <TableCell>{province.feelsLike}</TableCell>
                <TableCell>{province.tempMin}</TableCell>
                <TableCell>{province.tempMax}</TableCell>
                <TableCell>{province.pressure}</TableCell>
                <TableCell>{province.humidity}</TableCell>
                <TableCell>{province.windSpeed}</TableCell>
                <TableCell>{province.weatherMain}</TableCell>
                <TableCell>{province.weatherDescription}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(province.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={14}>
                Chọn tỉnh/thành và bấm "Lấy thời tiết" để hiển thị thông tin.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AffectedProvincesTable;
