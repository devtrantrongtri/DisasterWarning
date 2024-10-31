import React, { useState } from 'react';
import { Box } from '@mui/material';
import PersonalInfo from '../components/User/PersonalInfo';
import ActivityHistory from '../components/Home/ActivityHistory';
import SecuritySettings from '../components/Home/SecuritySettings';
import Preferences from '../components/Home/Preferences';
import UserStatistics from '../components/Home/UserStatistics';

const PersonalInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Sắp xếp theo chiều dọc
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        gap: 2, // Tạo khoảng cách giữa các component
        width: '100%', // Đảm bảo các component chiếm toàn bộ chiều rộng
      }}
    >
      <PersonalInfo />
      <ActivityHistory />
      <SecuritySettings />
      <Preferences />
      <UserStatistics />
    </Box>
  );
};

export default PersonalInfoPage;
