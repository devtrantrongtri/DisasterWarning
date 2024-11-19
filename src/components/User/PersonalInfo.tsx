import { Box, Typography, TextField,Select, Button, Grid, Avatar,MenuItem } from '@mui/material';
import React, { useState } from 'react';
import {useGetUserByIdQuery,useUpdateUserMutation } from '../../services/user.service';
import ActivityHistory from '../Home/ActivityHistory';

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const userId = Number(sessionStorage.getItem("userID"));

  // Lấy dữ liệu người dùng từ API
  const { data: user } = useGetUserByIdQuery(userId);

  // API cập nhật thông tin người dùng
  const [updateUser] = useUpdateUserMutation();

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

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleSavePassword = async () => {
    setIsEditingPassword(false);
  }

  const handleSave = async () => {
    try {
      // Ensure userId is converted to a number
      if (!userId || isNaN(Number(userId))) {
        alert('Invalid userId');
        return;
      }
      
      let role_ = sessionStorage.getItem('role');
      if(role_ == '[ROLE_ADMIN]'){
        role_ = 'admin';
      }
      else{
        role_ = 'user';
      }
      const numericUserId = Number(userId);
  
      // Call the API to update the user
      await updateUser({
        userId: numericUserId,
        userName: formData.username || undefined,
        email: formData.email || undefined,
        password: '',
        role: role_ || undefined,
        status: '',
        location: { locationName: formData.city }
      }).unwrap();
  
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  };
  

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4,backdropFilter: 'blur(20px)'
    ,borderRadius: 2, boxShadow: 3 , mt: 5}}>
      {/* Avatar và tên tài khoản */}
      <Box sx={{ textAlign: 'center', marginRight: 4 ,flexDirection: 'column',}}>
        <Avatar sx={{ width: 100, height: 100, margin: '0 auto' }} />
        <Typography variant="h4" sx={{ mt: 2 }}>{formData.username}</Typography>
          {/* lich su hoat dong */}
          <ActivityHistory /> 
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
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dce9f5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e5e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e5e5e5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#e5e5e5', // Đổi màu label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#e5e5e5', // Đổi màu label khi có focus
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quốc gia"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={"Việt Nam"}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dce9f5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e5e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e5e5e5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#e5e5e5', // Đổi màu label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#e5e5e5', // Đổi màu label khi có focus
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              disabled={!isEditingPassword}
              value={formData.password}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dce9f5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e5e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e5e5e5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#e5e5e5', // Đổi màu label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#e5e5e5', // Đổi màu label khi có focus
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              label="Tỉnh/Thành phố"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dce9f5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e5e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e5e5e5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#e5e5e5',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#e5e5e5',
                },
              }}
            >
              {/* Thêm các tỉnh/thành phố vào đây */}
              <MenuItem value="An Giang">An Giang</MenuItem>
              <MenuItem value="Ba Ria Vung Tau">Bà Rịa - Vũng Tàu</MenuItem>
              <MenuItem value="Bac Giang">Bắc Giang</MenuItem>
              <MenuItem value="Bac Kan">Bắc Kạn</MenuItem>
              <MenuItem value="Bac Lieu">Bạc Liêu</MenuItem>
              <MenuItem value="Bac Ninh">Bắc Ninh</MenuItem>
              <MenuItem value="Ben Tre">Bến Tre</MenuItem>
              <MenuItem value="Binh Dinh">Bình Định</MenuItem>
              <MenuItem value="Binh Duong">Bình Dương</MenuItem>
              <MenuItem value="Binh Phuoc">Bình Phước</MenuItem>
              <MenuItem value="Binh Thuan">Bình Thuận</MenuItem>
              <MenuItem value="Ca Mau">Cà Mau</MenuItem>
              <MenuItem value="Cao Bang">Cao Bằng</MenuItem>
              <MenuItem value="Da Nang">Đà Nẵng</MenuItem>
              <MenuItem value="Dak Lak">Đắk Lắk</MenuItem>
              <MenuItem value="Dak Nong">Đắk Nông</MenuItem>
              <MenuItem value="Dien Bien">Điện Biên</MenuItem>
              <MenuItem value="Dong Nai">Đồng Nai</MenuItem>
              <MenuItem value="Dong Thap">Đồng Tháp</MenuItem>
              <MenuItem value="Gia Lai">Gia Lai</MenuItem>
              <MenuItem value="Ha Giang">Hà Giang</MenuItem>
              <MenuItem value="Ha Nam">Hà Nam</MenuItem>
              <MenuItem value="Ha Noi">Hà Nội</MenuItem>
              <MenuItem value="Ha Tinh">Hà Tĩnh</MenuItem>
              <MenuItem value="Hai Duong">Hải Dương</MenuItem>
              <MenuItem value="Hai Phong">Hải Phòng</MenuItem>
              <MenuItem value="Hau Giang">Hậu Giang</MenuItem>
              <MenuItem value="Hoa Binh">Hòa Bình</MenuItem>
              <MenuItem value="Hung Yen">Hưng Yên</MenuItem>
              <MenuItem value="Khanh Hoa">Khánh Hòa</MenuItem>
              <MenuItem value="Kien Giang">Kiên Giang</MenuItem>
              <MenuItem value="Kon Tum">Kon Tum</MenuItem>
              <MenuItem value="Lai Chau">Lai Châu</MenuItem>
              <MenuItem value="Lam Dong">Lâm Đồng</MenuItem>
              <MenuItem value="Lang Son">Lạng Sơn</MenuItem>
              <MenuItem value="Lao Cai">Lào Cai</MenuItem>
              <MenuItem value="Long An">Long An</MenuItem>
              <MenuItem value="Nam Dinh">Nam Định</MenuItem>
              <MenuItem value="Nghe An">Nghệ An</MenuItem>
              <MenuItem value="Ninh Binh">Ninh Bình</MenuItem>
              <MenuItem value="Ninh Thuan">Ninh Thuận</MenuItem>
              <MenuItem value="Phu Tho">Phú Thọ</MenuItem>
              <MenuItem value="Phu Yen">Phú Yên</MenuItem>
              <MenuItem value="Quang Binh">Quảng Bình</MenuItem>
              <MenuItem value="Quang Nam">Quảng Nam</MenuItem>
              <MenuItem value="Quang Ngai">Quảng Ngãi</MenuItem>
              <MenuItem value="Quang Ninh">Quảng Ninh</MenuItem>
              <MenuItem value="Quang Tri">Quảng Trị</MenuItem>
              <MenuItem value="Soc Trang">Sóc Trăng</MenuItem>
              <MenuItem value="Son La">Sơn La</MenuItem>
              <MenuItem value="Tay Ninh">Tây Ninh</MenuItem>
              <MenuItem value="Thai Binh">Thái Bình</MenuItem>
              <MenuItem value="Thai Nguyen">Thái Nguyên</MenuItem>
              <MenuItem value="Thanh Hoa">Thanh Hóa</MenuItem>
              <MenuItem value="Thua Thien Hue">Thừa Thiên Huế</MenuItem>
              <MenuItem value="Tien Giang">Tiền Giang</MenuItem>
              <MenuItem value="Tra Vinh">Trà Vinh</MenuItem>
              <MenuItem value="Tuyen Quang">Tuyên Quang</MenuItem>
              <MenuItem value="Vinh Long">Vĩnh Long</MenuItem>
              <MenuItem value="Vinh Phuc">Vĩnh Phúc</MenuItem>
              <MenuItem value="Yen Bai">Yên Bái</MenuItem>
              {/* Các giá trị khác */}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dce9f5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e5e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e5e5e5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#e5e5e5', // Đổi màu label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#e5e5e5', // Đổi màu label khi có focus
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Nút chỉnh sửa và hoàn tất */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          {isEditing ? (
            <Button variant="contained" 
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#f7fafc',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: '#e2e8f0',
              },
            }} onClick={handleSave}>
              Hoàn tất
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={handleEdit}
               sx={{
                mt: 3,
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#f7fafc',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
              }}>
                Chỉnh sửa
              </Button>
              {isEditingPassword ? (
                <Button variant="contained"  onClick={handleSavePassword}
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#f7fafc',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: '#e2e8f0',
                  },
                }}>
                  Hoàn tất
                </Button>
              ) : (
              <Button variant="outlined" onClick={handleEditPassword}
               sx={{
                mt: 3,
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#f7fafc',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
              }}>
                Đổi mật khẩu
              </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfo;
