import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link } from 'react-router-dom';


const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout title="Forgot Password? 🤔" subtitle="No worries, we will send you reset instructions">
      <TextField label="Email Address" fullWidth margin="normal" />
      <Button component={Link} to="/auth/verification-code" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Get OTP</Button>
      <Button  component={Link} to="/auth" variant="text" sx={{ mt: 2 }}>← Back to Login</Button>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
