// src/components/Admin/DisasterChart.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const DisasterChart: React.FC = () => {
  const disasterData = {
    labels: ['Lũ lụt', 'Hạn hán', 'Động đất', 'Bão', 'Lốc xoáy', 'Sóng thần'],
    datasets: [
      {
        label: 'Số lượng',
        data: [5, 8, 2, 10, 4, 6], // dữ liệu mẫu
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Thống kê số lượng thiên tai mỗi loại trong năm
      </Typography>
      <Bar data={disasterData} />
    </Box>
  );
};

export default DisasterChart;
