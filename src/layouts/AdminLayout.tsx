import React from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Container, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          </Typography>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/dashboard/disaster-details">Disaster Details</Button>
          <Button color="inherit" component={Link} to="/dashboard/disaster-categories">Disaster Categories</Button>
          <Button color="inherit" component={Link} to="/dashboard/user-management">User Management</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 8, padding: 2, width: '100%' }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AdminLayout;
