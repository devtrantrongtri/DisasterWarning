import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AuthLayout from '../../layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../stores/slices/user.slice';
import { useLoginMutation } from '../../services/user.service';
import { notification } from 'antd';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        role: 'admin',
      }).unwrap();



      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationDate', response.data.expirationDate);
        localStorage.setItem('userID', response.data.userId.toString());
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('isAuthen', 'true');
      } else {
        localStorage.setItem('token', response.data.token);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('expirationDate', response.data.expirationDate);
        sessionStorage.setItem('userID',response.data.userId.toString());
        sessionStorage.setItem('role',response.data.role);
        localStorage.setItem('isAuthen', 'true');
      }

      localStorage.setItem('userName', response.data.userName);
      setUsername(response.data.userName);
      dispatch(loginSuccess(response.data));
      navigate('/info');

      notification.success({
        message: 'Đăng nhập thành công',
        description: 'Bạn đã đăng nhập thành công.',
        duration: 3,
        placement: 'top',
      });
    } catch (err) {
      console.error('Đăng nhập thất bại', err);

      notification.error({
        message: 'Đăng nhập thất bại',
        description: 'Vui lòng kiểm tra email và mật khẩu.',
        duration: 3,
        placement: 'top',
      });
    }
  };

  function isFetchBaseQueryError(
    error: FetchBaseQueryError | SerializedError
  ): error is FetchBaseQueryError {
    return (error as FetchBaseQueryError).status !== undefined;
  }

  function isSerializedError(
    error: FetchBaseQueryError | SerializedError
  ): error is SerializedError {
    return (error as SerializedError).message !== undefined;
  }

  return (
    <AuthLayout
      title={
        username ? (
          <>
            Chào mừng trở lại 👋 <br />
            {username}
          </>
        ) : (
          'Chào mừng trở lại 👋'
        )
      }
      subtitle="Tiếp tục với Google hoặc nhập thông tin của bạn"
    >

      <Box sx={{ mt: 2, px: 5, py: 10, borderRadius: 2, boxShadow: 3, backdropFilter: 'blur(20px)' }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{ mb: 2, py: 1, fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main', backgroundColor: '#f7fafc' }}
        >
          Tiếp tục với Google
        </Button>
        <Divider sx={{ fontSize: '1.2rem', my: 3, color: '#f7fafc','&::before, &::after': { borderColor: '#ffffff' }}}>hoặc</Divider>
        <TextField
          label="Địa chỉ Email"
          fullWidth
          margin="normal"
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
<TextField
  label="Mật khẩu"
  type="password"
  fullWidth
  margin="normal"
  value={formData.password}
  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{ color: '#f7fafc' }}
            />
          }
          label="Ghi nhớ đăng nhập"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#e5e5e5',
              fontWeight: 'bold',
            },
          }}
        />
      {error && (
        <Typography color="error" variant="body2">
        {isFetchBaseQueryError(error) && typeof error.data === 'object' && error.data && 'data' in error.data
          ? (error.data as { data: string }).data
          : isSerializedError(error) && error.message
          ? error.message
          : 'Login failed'}
        </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
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
          }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
        <Typography variant="body2" mt={3} textAlign="center">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" style={{ textDecoration: 'none', color: '#dce9f5' }}>
            Tạo tài khoản
          </Link>
        </Typography>
        <Typography variant="body2" mt={2} textAlign="center">
          Quên mật khẩu?{' '}
          <Link to="/auth/forgot-password" style={{ textDecoration: 'none', color: '#dce9f5' }}>
            Nhấn vào đây
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;

