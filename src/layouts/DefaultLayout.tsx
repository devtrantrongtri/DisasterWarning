import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backgroundImage from '../assets/sunny.jpeg'; // Đường dẫn đến ảnh nền

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100%"
    >
      {/* Header luôn nằm ở đầu */}
      <Header />

      {/* Children sẽ lấp đầy khoảng trống giữa header và footer */}
      <Box
        flexGrow={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {children}
      </Box>

      {/* Footer luôn nằm cuối */}
      <Footer />
    </Box>
  );
}

export default DefaultLayout;
