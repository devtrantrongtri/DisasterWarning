import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const SupportPage: React.FC = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5' }}>
      {/* Phần hình ảnh thông tin cứu trợ */}
      <Paper
        elevation={3}
        sx={{
          height: 150,
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
        }}
      >
        <Typography variant="h6">Ảnh thông tin cứu trợ</Typography>
      </Paper>

      {/* Các đội cứu trợ */}
      <Grid container spacing={4} justifyContent="center">
        {['ĐỘI CỨU TRỢ A', 'ĐỘI CỨU TRỢ B', 'ĐỘI CỨU TRỢ C'].map((team, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {team}
              </Typography>
              <Typography variant="body1">CONTENT</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SupportPage;