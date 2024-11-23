import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import CuuTroImage from '../../assets/cuutro.png';
import HoiChuThapDoImg from '../../assets/HCTĐ.png';
import MTTQHueImg from '../../assets/MTTQHue.jpg';
import MTTQHCMImg from '../../assets/MTTQHCM.jpg';

const SupportPage: React.FC = () => {
  const regions = [
    {
      name: 'Miền Bắc',
      info: 'Hội Chữ thập đỏ Việt Nam\nĐịa chỉ: 82 Nguyễn Du, Hai Bà Trưng, Hà Nội\nSĐT: 024 38 224 030\n\nỦy ban Mặt trận Tổ quốc Việt Nam\nĐịa chỉ: Số 46 Tràng Thi, quận Hoàn Kiếm, Hà Nội\nSố điện thoại: 08 046 154\n\n',
      image: HoiChuThapDoImg,
    },
    {
      name: 'Miền Trung',
      info: 'Hội Chữ thập đỏ Đà Nẵng\nĐịa chỉ: 522 Ông Ích Khiêm, Hải Châu, Đà Nẵng\nSĐT: 0236 3821 185\n\nỦy ban Mặt trận Tổ quốc Việt Nam tỉnh Thừa Thiên Huế\nĐịa chỉ: Số 47 Hai Bà Trưng, thành phố Huế, Thừa Thiên Huế\nSố điện thoại: 0234 3823 823\n\n',
      image: MTTQHueImg,
    },
    {
      name: 'Miền Nam',
      info: 'Hội Chữ thập đỏ TP.HCM\nĐịa chỉ: 201 Nguyễn Thị Minh Khai, Quận 1, TP.HCM\nSĐT: 028 38 325 729 - 028 39 255 626\n\nỦy ban Mặt trận Tổ quốc Việt Nam TP. Hồ Chí Minh\nĐịa chỉ: Số 55 Mạc Đĩnh Chi, phường Đa Kao, quận 1, TP. Hồ Chí Minh\nSố điện thoại: 028 38 221 368 - 028 38 244 848',
      image: MTTQHCMImg,
    },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: 'transparent',
        boxShadow: 3,
        pd: 10,
        margin: 7,
        borderRadius: '10px',
        backdropFilter: 'blur(5px)',
      }}
    >
      {/* Phần hình ảnh thông tin cứu trợ */}
      <Typography
        sx={{
          position: 'absolute',
          height: '600px',
          width:'96%',
          borderRadius: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          fontWeight: 'bold',
          color:'white',

          
        }}
      >
      </Typography> 

      <Typography
      variant="h5"
      sx={{
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        textShadow:'2px 2px 2px rgba(45, 58, 84, 0.8)',
        textAlign:'center',
        width:'100%',
        top:'10%',
        fontSize:'55px',
        fontFamily:'Verdana'
      }}
    >
      THÔNG TIN CỨU TRỢ
    </Typography>

    <Typography
      sx={{
        position: 'absolute',
        color: '#e9d5d5',
        fontWeight: 'bold',
        textShadow:'2px 2px 2px rgba(45, 58, 84, 0.8)',
        width:'100%',
        top:'35%',
        fontSize:'25px',
        fontFamily:'Verdana',
        marginLeft:"500px",
      }}
    >
      Hãy liên hệ khi cần thiết!
    </Typography>

      <Paper
        elevation={3}
        sx={{
          height: '600px',
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(213, 208, 208, 0.4)',
          borderRadius: '40px'
        }}
      >
        <img
          src={CuuTroImage}
          alt="Ảnh thông tin cứu trợ"
          style={{ height: '100%', objectFit: 'contain' }}
        />
      </Paper>

      <Grid container spacing={4} justifyContent="center">
        {regions.map((region, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(224, 224, 224, 0.3)',
                borderRadius:10,
              }}
            >
              {/* Hình ảnh */}
                <Box component="img"
              src={region.image}
              alt={region.name}
              sx={{
                height: "150px",
                borderRadius: "800px",
                boxShadow: 4,
                marginBottom: 2,
              }}
              />

              {/* Tên miền */}
              <Typography variant="h4" gutterBottom sx={{fontWeight:500, color:'#2D3A53',fontFamily:'Verdana'}}>
                {region.name}
              </Typography>

              {/* Thông tin */}
              <Typography variant="body1" align="center" whiteSpace="pre-line">
                {region.info}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SupportPage;
