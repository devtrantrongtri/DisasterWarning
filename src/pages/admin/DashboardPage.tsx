import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale } from 'chart.js';
// import 'react-open-weather/lib/css/ReactWeather.css';

// Register the CategoryScale to fix the scale issue
Chart.register(CategoryScale);

const DashboardPage: React.FC = () => {
  // Sample data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Thiên tai mỗi loại',
        data: [3, 2, 1, 4, 6, 5, 8, 7, 4, 3, 6, 9],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Số lượng người dùng</Typography>
              <Typography variant="h3">10</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Số lượng cảnh báo được gửi đi</Typography>
              <Typography variant="h3">50</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weather Widget */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5">June 20 - Weather Report</Typography>
          <Typography variant="h3">67°F</Typography>
          <Typography variant="subtitle1">Ho Chi Minh City, Vietnam</Typography>
          {/* Additional weather details */}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Box sx={{ mr: 4 }}>
              <Typography variant="body2">UV Index: 06</Typography>
              <Typography variant="body2">Humidity: 58%</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Wind: 7 mph ESE</Typography>
              <Typography variant="body2">Pressure: 29.97 in</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Statistics and Tables */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Thống kê số lượng thiên tai mỗi loại trong năm
        </Typography>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Line data={data} />
        </Paper>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bảng các tỉnh/thành bị ảnh hưởng thiên tai gần đây nhất
        </Typography>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography>Đang cập nhật thông tin...</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
