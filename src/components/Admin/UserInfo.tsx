import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

const UserInfo: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">Số lượng người dùng</Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>10</Typography>
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">Số lượng cảnh báo được gửi đi</Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>50</Typography>
      </Paper>
    </Box>
  );
};

export default UserInfo;
