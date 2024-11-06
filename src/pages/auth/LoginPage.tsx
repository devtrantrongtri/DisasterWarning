import React from 'react';
import { Button, TextField, Typography, Divider, Checkbox, FormControlLabel } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AuthLayout from '../../layouts/AuthLayout';
import { Link } from 'react-router-dom';


const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Welcome Back, Jonathan 👋" subtitle="Continue with Google or Enter LoginPage Details">
      <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth sx={{ mb: 2 }}>
        Continue with Google
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <TextField label="Email Address" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <FormControlLabel control={<Checkbox />} label="Remember me" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Log In</Button>
      <Typography variant="body2" mt={2}>
        Don’t have an account yet? <Link to={"/auth/register"}>Create account</Link>
      </Typography>
      <Typography variant="body2" mt={2}>
        Forgot password ?  <Link to={"/auth/forgot-password"}>CLick here .</Link>
      </Typography>
    </AuthLayout>
  );
};

export default LoginPage;
