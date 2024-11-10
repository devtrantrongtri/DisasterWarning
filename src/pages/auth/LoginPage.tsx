import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AuthLayout from '../../layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SerializedError } from '@reduxjs/toolkit';
import { loginSuccess } from '../../stores/slices/user.slice';
import { useLoginMutation } from '../../services/user.service';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { notification } from 'antd';

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
      } else {
        sessionStorage.setItem('token', response.data.token);
      }

      localStorage.setItem('username', response.data.userName);
      setUsername(response.data.userName);
      dispatch(loginSuccess(response.data));
      navigate('/info');

      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
        duration: 3,
        placement:'top'
      });
    } catch (err) {
      console.error('Login failed', err);

      notification.error({
        message: 'Login Failed',
        description: 'Please check your email and password.',
        duration: 3,
        placement:'top'
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
      title={username ? `Welcome Back 👋 ${username}` : 'Welcome Back 👋'}
      subtitle="Continue with Google or Enter your details"
    >
      <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth sx={{ mb: 2 }}>
        Continue with Google
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Remember me"
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
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
      <Typography variant="body2" mt={2}>
        Don’t have an account yet? <Link to="/auth/register">Create account</Link>
      </Typography>
      <Typography variant="body2" mt={2}>
        Forgot password? <Link to="/auth/forgot-password">Click here</Link>
      </Typography>
    </AuthLayout>
  );
};

export default LoginPage;
