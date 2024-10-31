import React from 'react';
import { Box } from '@mui/material';
import WeatherForecast from '../components/Home/WeatherForecast';
import DisasterInfo from '../components/Home/DisasrerInfo';

function HomePage() {
  // Đối tượng chứa thông tin về hình ảnh và mô tả thiên tai
  const disasterData = {
    imageUrl: "https://media.puhoat.vn/CMSImage/Resources/Uploaded/puhoat/2022-07-17t221943z-283722386-rc2xdv9fd21d-rtrmadp-3-europe-weather-france-wildfires-4550-1684810753849870115111-2024-06-11-15-46.jpg?1718095611657",
    description: "Cháy rừng là một trong những loại thiên tai nguy hiểm, xảy ra khi các khu vực rừng hoặc thảm thực vật bị cháy không kiểm soát. Các nguyên nhân gây cháy rừng bao gồm cả tự nhiên, như sét đánh, và tác động của con người, như hành vi đốt nương làm rẫy hoặc vô ý vứt tàn thuốc lá. Cháy rừng thường lan nhanh, phá hủy hệ sinh thái, gây thiệt hại lớn về môi trường và đe dọa tính mạng con người, động vật hoang dã, cũng như tài sản.\n Khi xảy ra cháy rừng, khói bụi lan tỏa gây ô nhiễm không khí và ảnh hưởng đến sức khỏe cộng đồng, đặc biệt là những người có bệnh về hô hấp. Các vụ cháy lớn còn có thể tạo ra những vùng không khí nóng, ảnh hưởng đến khí hậu khu vực. Việc kiểm soát cháy rừng là một thách thức lớn đối với các cơ quan chức năng, đòi hỏi công nghệ hiện đại, nhân lực chuyên nghiệp, và sự phối hợp của cộng đồng để ngăn chặn và giảm thiểu thiệt hại."
  };

  // Đối tượng chứa thông tin dự báo thời tiết
  const weatherData = {
    location: "Hồ Chí Minh / Huế",
    weatherIconUrl: "https://a0.anyrgb.com/pngimg/140/730/bad-weather-hot-weather-cold-weather-weathered-weather-forecast-weather-icon-world-wide-web-clouds-weather-avatar.png",
    forecast: "Dự báo thời tiết (Default Hà Nội)",
    humidity: "80%",
    windSpeed: "15 km/h",
    temperature: "28°C",
  };

  return (
    <Box>
      <DisasterInfo {...disasterData} />
      <WeatherForecast {...weatherData} />
    </Box>
  );
}

export default HomePage;
