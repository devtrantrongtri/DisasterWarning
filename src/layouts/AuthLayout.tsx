import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item xs={12} md={6} style={{ backgroundImage: 'url("https://photo.znews.vn/w960/Uploaded/mdf_eioxrd/2020_11_24/ca279e81_c521_4d21_98f0_29af72180cad_July_California_edited_1_.jpg")', backgroundSize: 'cover' }} />
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '80%', maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>{title}</Typography>
          {subtitle && <Typography variant="body1" color="textSecondary" mb={4}>{subtitle}</Typography>}
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
