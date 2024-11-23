import { Box, Typography, Grid } from '@mui/material';
import { useCountTokenQuery } from '../../services/user.service'; // Điều chỉnh đường dẫn đúng
import { useEffect, useState } from 'react';

const UserStatistics = () => {
  // Lấy userId từ sessionStorage và chuyển thành số
  const userId = Number(sessionStorage.getItem("userID"));

  // Sử dụng hook từ RTK Query để lấy số lượng token (tài khoản đang đăng nhập)
  const { data, isLoading, error } = useCountTokenQuery(userId);

  // State để lưu thời gian hoạt động (tính bằng mili giây)
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Lấy thời gian expirationDate từ sessionStorage
    const expirationDate = sessionStorage.getItem("expirationDate");

    if (expirationDate) {
      
      // Chuyển expirationDate thành thời gian mili giây
      const cleanExpirationDate = expirationDate.split('T')[0]; // Cắt bỏ phần sau dấu chấm (microseconds)\
      console.log('Login Time 1:', cleanExpirationDate);
      const loginTime = new Date(cleanExpirationDate).getTime();

      console.log('Login Time:', loginTime);

      const updateTime = () => {
        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - loginTime;
        console.log("a: ",elapsedMilliseconds);
        setElapsedTime(elapsedMilliseconds); // Cập nhật thời gian vào state
      };

      // Cập nhật thời gian hoạt động ngay lập tức
      updateTime();

      // Cập nhật thời gian mỗi giây
      const interval = setInterval(updateTime, 1000);

      // Dọn dẹp interval khi component bị hủy
      return () => clearInterval(interval);
    }
  }, []);

    // Function to format date as dd/mm/yyyy - hh:mm
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

  // Chuyển đổi thời gian hoạt động từ mili giây thành giờ, phút và giây
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)); // Tính số giờ
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)); // Tính số phút
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000); // Tính số giây

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Thống kê tài khoản</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1">Số thiết bị đang đăng nhập:</Typography>
          {/* Hiển thị thông tin từ API hoặc thông báo nếu đang tải hoặc có lỗi */}
          {isLoading ? (
            <Typography variant="h6">Đang tải...</Typography>
          ) : error ? (
            <Typography variant="h6" color="error">Lỗi khi tải dữ liệu</Typography>
          ) : (
            // Hiển thị số thiết bị đang đăng nhập từ API
            <Typography variant="h6">{data?.data}</Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Thời gian hoạt động:</Typography>
          {/* Hiển thị thời gian hoạt động */}
          <Typography variant="h6">{`${hours} giờ ${minutes} phút ${seconds} giây`}</Typography>
        </Grid>
        {/* Thêm các thông tin thống kê khác */}
      </Grid>
    </Box>
  );
};

export default UserStatistics;
