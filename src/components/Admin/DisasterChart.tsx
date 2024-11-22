// src/components/Admin/DisasterChart.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js'; // Import types from chart.js
import 'chart.js/auto';

const disasterData: ChartData<'bar'> = {  // Specify chart type as 'bar'
  labels: ['Lũ lụt', 'Hạn hán', 'Động đất', 'Bão', 'Lốc xoáy', 'Sóng thần'],
  datasets: [
    {
      label: 'Số lượng',
      data: [5, 8, 2, 10, 4, 6], // Sample data
      backgroundColor: 'rgba(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const DisasterChart: React.FC = () => {
  const options: ChartOptions<'bar'> = {  // Specify chart type as 'bar'
    responsive: true,
    scales: {
      y: {
        grid: {
          display: false, // Tắt lưới trên trục Y
        },
        ticks: {
          color: '#ffffff', // Set Y axis label color to white
        },
      },
      x: {
        grid: {
          display: false, // Tắt lưới trên trục X
        },
        ticks: {
          color: '#ffffff', // Set X axis label color to white
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Set legend text color to white
        },
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItem: any) {
            return tooltipItem[0].label; // Tooltip title text color
          },
          label: function (tooltipItem: any) {
            return tooltipItem.formattedValue; // Tooltip label text color
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        marginBottom: 2,
        textAlign: 'center',
        background: 'transparent', // No background
        backdropFilter: 'blur(10px)', // Optional: blurred effect on background
        color: '#030302', // Text color
        boxShadow: 'none',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Thống kê số lượng thiên tai mỗi loại trong năm
      </Typography>
      <Bar data={disasterData} options={options} />
    </Box>
  );
};

export default DisasterChart;
