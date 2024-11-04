import React from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';


const VerificationCodePage: React.FC = () => {
  return (
    <AuthLayout title="Enter Verification Code" subtitle="We have just sent a verification code to jonathandoe@gmail.com">
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {[...Array(4)].map((_, index) => (
          <TextField key={index} variant="outlined" inputProps={{ maxLength: 1 }} />
        ))}
      </Box>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Verify</Button>
      <Button variant="text" sx={{ mt: 2 }}>Resend Code</Button>
    </AuthLayout>
  );
};

export default VerificationCodePage;
