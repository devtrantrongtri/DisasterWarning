import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateLocationMutation, useRegisterMutation } from '../../services/user.service';
import { City } from '../../interfaces/WeatherType';
import CitySelector from '../../components/Admin/CitySelector';
import { displayErrorNotification } from '../../utils/errorHandlers';
import { notification } from 'antd';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationOptionSelected, setLocationOptionSelected] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const navigate = useNavigate();
  const [register, { isLoading, isSuccess, isError, error }] = useRegisterMutation();
  const [createLocation] = useCreateLocationMutation();

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationOptionSelected(true);
          setOpenLocationDialog(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng thử phương thức khác.');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Geolocation.');
    }
  };

  const handleCitySelect = (city: City) => {
    setCoordinates({
      latitude: city.coord.lat,
      longitude: city.coord.lon,
    });
    setLocationOptionSelected(true);
    setOpenLocationDialog(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordinates && !hasNotified) {
      notification.warning({
        message: 'Thông báo',
        description: 'Bạn chưa chọn địa điểm. Vui lòng chọn trước khi đăng ký.',
        duration: 3,
      });
      setHasNotified(true);
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    let locationId = null;

    if (coordinates) {
      try {
        const locationResponse = await createLocation({
          locationName: `${userName}'s location`,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }).unwrap();

        locationId = locationResponse.data.locationId;
      } catch (err) {
        console.error('Lỗi khi tạo địa điểm:', err);
        alert('Không thể tạo địa điểm. Vui lòng thử lại.');
        return;
      }
    }

    try {
      const response = await register({
        userName,
        email,
        password,
        role: 'USER',
        location: locationId ? { locationId } : undefined,
      }).unwrap();

      navigate('/auth')
    } catch (err) {
      console.error('Đăng ký thất bại', err);
      displayErrorNotification(error); 
    }
  };

  return (
    <AuthLayout
      title="Đăng Ký Tài Khoản"
      subtitle="Vui lòng nhập thông tin để tạo tài khoản mới"
    >
      <form onSubmit={handleRegister}>
        <Box sx={{ mt: 2, px: 3, py: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
          <TextField
            label="Tên người dùng"
            type="text"
            variant="outlined"
            fullWidth
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            onClick={() => setOpenLocationDialog(true)}
            sx={{
              mt: 2,
              color: locationOptionSelected ? 'primary.main' : 'text.secondary',
              fontWeight: locationOptionSelected ? 'bold' : 'normal',
              backgroundColor: locationOptionSelected ? 'background.default' : 'transparent',
              ':hover': { bgcolor: 'primary.light' },
            }}
          >
            {locationOptionSelected ? 'Địa điểm đã chọn' : 'Chọn phương thức cung cấp địa điểm'}
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 3, py: 1.2, fontSize: '1rem', fontWeight: 'bold' }}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </Button>
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Đăng ký thất bại. Vui lòng thử lại.
            </Typography>
          )}
          {isSuccess && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Đăng ký thành công!
            </Typography>
          )}
          <Typography variant="body2" mt={3} textAlign="center">
            Đã có tài khoản? <Link to="/auth" style={{ textDecoration: 'none', color: '#1976d2' }}>Đăng nhập</Link>
          </Typography>
        </Box>
      </form>

      {/* Dialog để chọn địa điểm */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>Chọn Phương Thức Địa Điểm</DialogTitle>
        <DialogContent>
          <Button variant="contained" onClick={handleUseCurrentLocation} fullWidth sx={{ my: 2, py: 1.5, fontSize: '1rem' }}>
            Sử dụng vị trí hiện tại
          </Button>
          <Divider>or</Divider>

          <CitySelector onCitySelect={handleCitySelect} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenLocationDialog(false)} color="secondary" variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </AuthLayout>
  );
};

export default RegistrationPage;
