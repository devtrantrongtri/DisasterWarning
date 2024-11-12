import { Box, Typography } from '@mui/material';
import React from 'react';

function DisasterWarning() {
  return (
    <Box 
      sx={{ 
        borderRadius: '8px', 
        padding: '16px', 
        maxWidth: '500px',
        margin: '0 auto',
        // color: "white",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold',fontSize: '1.5rem' }}>
        CẢNH BÁO THIÊN TAI: <hr/>
        <span style={{ fontSize:"1.5rem" }}> LŨ LỤT</span>
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '8px', fontSize: '1rem' }}>
        <strong>Thời gian:</strong> 12/12/2024
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '8px', fontSize: '1rem' }}>
        <strong>Mô tả:</strong> CẢNH BÁO NGẬP LỤT CỤC BỘ: Mưa lớn với lượng mưa 5,9 mm/giờ. Đề phòng ngập úng tại các khu vực trũng thấp. 
        Khuyến cáo: Theo dõi thông tin thời tiết. Chuẩn bị các phương án ứng phó với ngập lụt.
        Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.
      </Typography>
    </Box>
  );
}

export default DisasterWarning;
