import { Box, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetUserCountQuery, useGetAlertCountQuery } from '../../services/dashboard.service';

const UserInfo: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [alertCount, setAlertCount] = useState<number | null>(null);

  const { data: userData, isLoading: userLoading, error: userError } = useGetUserCountQuery();
  const { data: alertData, isLoading: alertLoading, error: alertError } = useGetAlertCountQuery();

  useEffect(() => {
    if (userData) {
      setUserCount(userData);  // Lưu số lượng người dùng từ API
    }
    if (alertData) {
      setAlertCount(alertData);  // Lưu số lượng cảnh báo từ API
    }
  }, [userData, alertData]);
  const paperStyle = {
    
    padding: 1,
    textAlign: 'center',
    minHeight: '150px',
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 0, // Remove the border radius to avoid any rounded edges
    background: 'transparent', // No background
    backdropFilter: 'blur(10px)', // Optional: blurred effect on background
    color:'#030302',
    boxShadow: 'none', // Remove any box shadow if present
  };
  
  
  
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 1}}>
      <Paper elevation={3} sx={paperStyle}>
        <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Số lượng người dùng</Typography>
        {userLoading ? (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Đang tải...</Typography>
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 'bold', color:'#fff' }}>
            {userCount ?? '0'}
          </Typography>
        )}
      </Paper>
  
      <Paper elevation={3} sx={paperStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Số lượng cảnh báo được gửi đi</Typography>
        {alertLoading ? (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Đang tải...</Typography>
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 'bold', color:'#fff' }}>
            {alertCount ?? '0'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
  
};

export default UserInfo;
