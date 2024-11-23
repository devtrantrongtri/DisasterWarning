import React from 'react';
import { Avatar } from '@mui/material';
import logo from '../assets/logo.svg';

const Logo: React.FC = () => {
  return (
    <Avatar
      src={logo}
      alt="Logo"
      sx={{
        width: 80,
        height: 80,
        gap: 4
      }}
    />
  );
};

export default Logo;
