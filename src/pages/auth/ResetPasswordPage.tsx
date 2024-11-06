import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link } from 'react-router-dom';


const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout title="Reset Password 😊" subtitle="Enter your new password to access your account">
      <TextField label="New Password" type="password" fullWidth margin="normal" />
      <TextField label="Confirm New Password" type="password" fullWidth margin="normal" />
      <Button component={Link} to="/" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Reset Password</Button>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
