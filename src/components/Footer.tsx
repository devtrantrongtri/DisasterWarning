import { Box, Typography } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmergencyIcon from '@mui/icons-material/Emergency';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';


function Footer() {
  return (
    <Box
      sx={{
        marginTop: 4,
        padding: 3,
        borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#d3f3ff',
        color: '#333',
      }}
    >
      {/* Phần Giới thiệu */}
      <Box sx={{alignSelf: 'center'}}>
        <Box
          component="img"
          src="https://cdn.pixabay.com/photo/2023/11/22/12/05/climate-change-8405380_1280.png"
          alt="Logo"
          sx={{ width: 70, height: 60, mb: 1, marginTop: '20px'}}
        />
        <Typography variant="h6"
              sx={{
                float: 'right',
                color: 'black',
                fontWeight: 'bold',
                marginLeft: '10px',
              }}>QUẢN LÝ <br></br>VÀ <br></br> CẢNH BÁO THIÊN TAI</Typography>
      </Box>

      <Box sx={{ alignSelf: 'center', width: '200px' }}>
        <HomeIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ mb: 1 }}>Trang chủ</Typography>
        <InfoIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ mb: 1}}>Thông tin về thiên tai</Typography>
        <LocationOnIcon sx={{ mr: 1, float: 'left' }} /><Typography variant="body2" sx={{ mb: 1 }}>Vị trí của bạn</Typography>
        <EmergencyIcon sx={{ mr: 1, float: 'left' }} /><Typography variant="body2">Thông tin cứu trợ</Typography>
      </Box>

      {/* Phần Hỗ trợ */}
      <Box sx={{ alignSelf: 'center', width: '200px'}}>
        <AccountCircleIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ mb: 1 }}>Đăng nhập</Typography>
        <EditIcon sx={{ mr: 1, float: 'left'}} />  <Typography variant="body2">Đăng ký</Typography>
      </Box>

      {/* Phần Liên hệ */}
      <Box sx={{ textAlign: 'center', alignSelf: 'center' }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Liên hệ chúng tôi</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>Email: vuontamthegioi@ut.com.vn</Typography>
        <Typography variant="body2">© 2024 Vươn Tầm Thế Giới</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
