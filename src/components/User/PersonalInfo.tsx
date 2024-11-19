import { Box, Typography, TextField, Button, Grid, Avatar } from '@mui/material';
import React, { useState } from 'react';
import {useGetUserByIdQuery } from '../../services/user.service';
const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const userId = Number(sessionStorage.getItem("userID"));

  // Lấy dữ liệu người dùng từ API
  const { data: user } = useGetUserByIdQuery(userId);

  const [formData, setFormData] = useState({
    username: '',
    country: '',
    password: '',
    city: '',
    email: '',
  });

  // Khi có dữ liệu, gán vào formData
  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.data.userName || '',
        country: '',
        password: user.data.password || '',
        city: user.data.location.locationName || '',
        email: user.data.email || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
      {/* Avatar và tên tài khoản */}
      <Box sx={{ textAlign: 'center', marginRight: 4 }}>
        <Avatar sx={{ width: 100, height: 100, margin: '0 auto' }} />
        <Typography variant="h4" sx={{ mt: 2 }}>{formData.username}</Typography>
      </Box>

      {/* Form thông tin cá nhân */}
      <Box
        sx={{
          border: '1px solid #ccc',
          padding: 3,
          borderRadius: 2,
          width: '100%',
          maxWidth: 800,
          height: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Personal Information
        </Typography>
        <Grid container spacing={2} sx={{ width: '80%' }} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên tài khoản"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.username}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quốc gia"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={"Việt Nam"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tỉnh/Thành phố"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.city}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.email}
            />
          </Grid>
        </Grid>

        {/* Nút chỉnh sửa và hoàn tất */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Hoàn tất
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={handleEdit}>
                Chỉnh sửa
              </Button>
              <Button variant="outlined" color="secondary">
                Đổi mật khẩu
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfo;
