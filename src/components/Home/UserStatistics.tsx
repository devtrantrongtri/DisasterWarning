import { Box, Typography, Grid } from '@mui/material';

const UserStatistics = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Thống kê tài khoản</Typography>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="body1">Số lần đăng nhập:</Typography>
        <Typography variant="h6">128</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1">Thời gian hoạt động:</Typography>
        <Typography variant="h6">45 giờ</Typography>
      </Grid>
      {/* Thêm các thông tin thống kê khác */}
    </Grid>
  </Box>
);

export default UserStatistics;
