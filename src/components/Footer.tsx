import { Box, Typography } from '@mui/material';
import React from 'react';

function Footer() {
  return (
    <Box
      sx={{
        marginTop: 4,
        padding: 3,
        borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        color: '#333',
      }}
    >
      {/* Phần Giới thiệu */}
      <Box sx={{ textAlign: 'center' }}>
        <Box
          component="img"
          src="https://cdn.pixabay.com/photo/2023/11/22/12/05/climate-change-8405380_1280.png"
          alt="Logo"
          sx={{ width: 50, height: 50, mb: 1 }}
        />
        <Typography variant="body2" sx={{ mb: 0.5 }}>Về chúng tôi</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Tin tức</Typography>
        <Typography variant="body2">Dịch vụ</Typography>
      </Box>

      {/* Phần Hỗ trợ */}
      <Box sx={{ textAlign: 'center', alignSelf: 'center' }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Hỗ trợ khách hàng</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Điều khoản dịch vụ</Typography>
        <Typography variant="body2">Chính sách bảo mật</Typography>
      </Box>

      {/* Phần Liên hệ */}
      <Box sx={{ textAlign: 'center', alignSelf: 'center' }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Liên hệ chúng tôi</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Email: vuontamthegioi@uth.com</Typography>
        <Typography variant="body2">© 2024 Vuon Tam The Gioi</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
