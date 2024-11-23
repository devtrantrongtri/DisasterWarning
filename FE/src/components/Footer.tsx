import { Box, Typography } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmergencyIcon from '@mui/icons-material/Emergency';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import Logo from './Logo';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <Box
      sx={{
        // marginTop: 4,
        padding: 3,
        // borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#2d3a54',
        color: '#e6eff5'
      }}
    >
      {/* Phần Giới thiệu */}
      <Box sx={{alignSelf: 'center',display:'flex'}}>
        <Logo/>
        <Typography variant="h6"
              sx={{
                float: 'right',
                fontWeight: 'bold',
                marginLeft: '10px',
              }}>QUẢN LÝ <br></br> & <br></br> CẢNH BÁO THIÊN TAI</Typography>
      </Box>

      <Box sx={{ alignSelf: 'center', width: '250px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <HomeIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ mb: 1, fontSize: '18px'}}>Trang chủ</Typography>
        </Link>
        <Link to="/disaster" style={{ textDecoration: 'none', color: 'inherit' }}>
        <InfoIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ mb: 1, fontSize: '18px'}}>Thông tin về thiên tai</Typography>
        </Link>
        {/* <LocationOnIcon sx={{ mr: 1, float: 'left' }} /><Typography variant="body2" sx={{ mb: 1, fontSize: '18px'}}>Vị trí của bạn</Typography>
        <EmergencyIcon sx={{ mr: 1, float: 'left'}} /><Typography variant="body2" sx={{ fontSize: '18px'}}>Thông tin cứu trợ</Typography> */}
      </Box>

      {/* Phần Hỗ trợ */}
      <Box sx={{ alignSelf: 'center', width: '200px' }}>
        <Link to="/auth" style={{ textDecoration: 'none', color: 'inherit' }}>
          <AccountCircleIcon sx={{ mr: 1, float: 'left' }} />
          <Typography variant="body2" sx={{ mb: 1, fontSize: '18px' }}>Đăng nhập</Typography>
        </Link>
        <Link to="/auth/register" style={{ textDecoration: 'none', color: 'inherit' }}>
          <EditIcon sx={{ mr: 1, float: 'left' }} />
          <Typography variant="body2" sx={{ fontSize: '18px' }}>Đăng ký</Typography>
        </Link>
      </Box>

      {/* Phần Liên hệ */}
      <Box sx={{ textAlign: 'center', alignSelf: 'center' }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '18px' }}>Liên hệ chúng tôi</Typography>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '18px' }}>Email: vuontamthegioi@ut.com.vn</Typography>
        <Typography variant="body2" sx={{ fontSize: '18px' }}>© 2024 Vươn Tầm Thế Giới</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
