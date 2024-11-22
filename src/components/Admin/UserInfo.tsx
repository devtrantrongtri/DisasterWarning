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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">Số lượng người dùng</Typography>
        {userLoading ? (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Đang tải...</Typography>
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {userCount ?? '0'}
          </Typography>
        )}
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">Số lượng cảnh báo được gửi đi</Typography>
        {alertLoading ? (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Đang tải...</Typography>
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {alertCount ?? '0'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UserInfo;
