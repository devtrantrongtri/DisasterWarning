import React from "react";
import { Box, Typography } from "@mui/material";
import AboutUsImage from "../../assets/aboutus.png";
const AboutUs: React.FC = () => {

  return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap:10, padding: 6 }}>
      {/* Phần hình ảnh chiếm một nửa */}
      <Box
        component="img"
        src={AboutUsImage}
        alt="Ảnh về chúng tôi"
        sx={{
          width: '800px',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />

      {/* Phần thông tin chiếm một nửa */}
      <Box sx={{ width: '50%'}}>
        <Typography variant="h3" gutterBottom sx={{color:'white', fontWeight:'bold'}}>
          Về chúng tôi
        </Typography>
        <Typography variant="body1" sx={{color:'white', fontSize:'18px'}}>
          Chúng tôi hân hạnh...................................................
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutUs;
