import React from 'react';
import { Box, Typography } from '@mui/material';

interface DisasterInfoProps {
  imageUrl: string;
  description: string;
}

const DisasterInfo: React.FC<DisasterInfoProps> = ({ imageUrl, description }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 10 }}>
      {/* Phần hình ảnh chiếm một nửa */}
      <Box
        component="img"
        src={imageUrl}
        alt="Ảnh về thiên tai"
        sx={{
          width: '50%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />

      {/* Phần thông tin chiếm một nửa */}
      <Box sx={{ width: '50%' }}>
        <Typography variant="h6" gutterBottom>
          Nội dung về thiên tai trong nước/quốc tế
        </Typography>
        <Typography variant="body1">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default DisasterInfo;
