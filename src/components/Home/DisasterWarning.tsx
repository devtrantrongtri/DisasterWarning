import { Box, Typography } from '@mui/material';
import React from 'react';

function DisasterWarning() {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#f0f4ff', 
        borderRadius: '8px', 
        padding: '16px', 
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>CẢNH BÁO THIÊN TAI: LŨ LỤT</Typography>
      <Typography variant="body2" sx={{ marginTop: '8px' }}>
        <strong>Thời gian:</strong> 12/12/2024
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '8px' }}>
        <strong>Mô tả:</strong> CẢNH BÁO NGẬP LỤT CỤC BỘ: Mưa lớn với lượng mưa 5,9 mm/giờ. Đề phòng ngập úng tại các khu vực trũng thấp. 
        Khuyến cáo: Theo dõi thông tin thời tiết. Chuẩn bị các phương án ứng phó với ngập lụt.
        Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.
      </Typography>
    </Box>
  );
}

export default DisasterWarning;
