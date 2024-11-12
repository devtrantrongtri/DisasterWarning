import React from 'react';
import { Box } from '@mui/material';
import WeatherDashboard from '../components/Home/WeatherDashboard'; // Import WeatherDashboard
import DisasterInfo from '../components/Home/DisasrerInfo';
import homeChayRung from '../assets/chayrung.png';

function HomePage() {
  // Đối tượng chứa thông tin về hình ảnh và mô tả thiên tai
  const disasterData = {
    imageUrl: homeChayRung,
    description: "Cháy rừng là một trong những loại thiên tai nguy hiểm, xảy ra khi các khu vực rừng hoặc thảm thực vật bị cháy không kiểm soát. Các nguyên nhân gây cháy rừng bao gồm cả tự nhiên, như sét đánh, và tác động của con người, như hành vi đốt nương làm rẫy hoặc vô ý vứt tàn thuốc lá. Cháy rừng thường lan nhanh, phá hủy hệ sinh thái, gây thiệt hại lớn về môi trường và đe dọa tính mạng con người, động vật hoang dã, cũng như tài sản.\n Khi xảy ra cháy rừng, khói bụi lan tỏa gây ô nhiễm không khí và ảnh hưởng đến sức khỏe cộng đồng, đặc biệt là những người có bệnh về hô hấp. Các vụ cháy lớn còn có thể tạo ra những vùng không khí nóng, ảnh hưởng đến khí hậu khu vực. Việc kiểm soát cháy rừng là một thách thức lớn đối với các cơ quan chức năng, đòi hỏi công nghệ hiện đại, nhân lực chuyên nghiệp, và sự phối hợp của cộng đồng để ngăn chặn và giảm thiểu thiệt hại."
  };

  return (
    <Box>
      <DisasterInfo {...disasterData} />
      <WeatherDashboard />

    </Box>
  );
}

export default HomePage;
