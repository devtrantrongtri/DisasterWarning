import React from 'react';
import { Button, TextField, Box } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link } from 'react-router-dom';


const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout title="Reset Password 😊" subtitle="Enter your new password to access your account">
     <Box sx={{ mt: 2, px: 5, py: 10, borderRadius: 2, boxShadow: 3, backdropFilter: 'blur(20px)' }}>
        <TextField label="New Password" type="password" fullWidth margin="normal" 
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
          }} />
        <TextField label="Confirm New Password" type="password" fullWidth margin="normal" 
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
        }}/>
        <Button component={Link} to="/" variant="contained" color="primary" fullWidth 
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
        >Reset Password</Button>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
