import React from 'react';
import { Box, Typography } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Box sx={{ width: '80%', maxWidth: 500 }}>
        <Typography variant="h4" gutterBottom>{title}</Typography>
        {subtitle && <Typography variant="body1" color="textSecondary" mb={4}>{subtitle}</Typography>}
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
