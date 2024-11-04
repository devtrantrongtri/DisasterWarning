// RegistrationPage.tsx

import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
//   const [, error }] = useRegisterMutation();
const register =  () =>  {alert("register")};
const isLoading = false;
const isSuccess = true;
const isError = false;
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    try {
      const response =  register();
      // Xử lý khi đăng ký thành công (ví dụ: chuyển hướng đến trang đăng nhập)
      console.log('Đăng ký thành công', response);
    } catch (err) {
      // Xử lý khi có lỗi
      console.error('Đăng ký thất bại', err);
    }
  };

  return (
    <AuthLayout title="Đăng Ký Tài Khoản" subtitle="Vui lòng nhập thông tin để tạo tài khoản mới">
      <form onSubmit={handleRegister}>
        <Box sx={{ mt: 2 }}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </Button>
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Đăng ký thất bại. Vui lòng thử lại.
            </Typography>
          )}
          {isSuccess && (
            <Typography color="success" sx={{ mt: 2 }}>
              Đăng ký thành công!
            </Typography>
          )}
           <Typography variant="body2" mt={2}>
        Already have an account ? <Link to={"/auth"}>Login</Link>
      </Typography>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default RegistrationPage;
