import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getActiveTab = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          height: 100,
          backgroundColor: '#D3F3FF',
          color: '#000000',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ minHeight: '100px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              '&:hover': { backgroundColor: 'rgba(224, 247, 250, 0.3)', transform: 'scale(1.1)' },
              transition: 'transform 0.3s ease',
            }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Button color="inherit" component={Link} to="/" sx={{ fontSize: '1.1rem' }}>
              Trang chủ
            </Button>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              sx={{
                fontWeight: getActiveTab('/dashboard') ? 'bold' : 'normal',
                color: getActiveTab('/dashboard') ? 'primary.main' : 'black',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': { color: '#1976D2', transform: 'scale(1.1)' },
                transition: 'transform 0.3s ease',
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard/disaster-details"
              sx={{
                fontWeight: getActiveTab('/dashboard/disaster-details') ? 'bold' : 'normal',
                color: getActiveTab('/dashboard/disaster-details') ? 'primary.main' : 'black',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': { color: '#1976D2', transform: 'scale(1.1)' },
                transition: 'transform 0.3s ease',
              }}
            >
              Disaster Details
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard/disaster-categories"
              sx={{
                fontWeight: getActiveTab('/dashboard/disaster-categories') ? 'bold' : 'normal',
                color: getActiveTab('/dashboard/disaster-categories') ? 'primary.main' : 'black',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': { color: '#1976D2', transform: 'scale(1.1)' },
                transition: 'transform 0.3s ease',
              }}
            >
              Disaster Categories
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard/user-management"
              sx={{
                fontWeight: getActiveTab('/dashboard/user-management') ? 'bold' : 'normal',
                color: getActiveTab('/dashboard/user-management') ? 'primary.main' : 'black',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': { color: '#1976D2', transform: 'scale(1.1)' },
                transition: 'transform 0.3s ease',
              }}
            >
              User Management
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{ '& .MuiDrawer-paper': { width: 250, backgroundColor: '#D3F3FF' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Sidebar Items */}
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Menu
            </Typography>
            <Divider />
            <List>
              <ListItem component={Link} to="/dashboard" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem component={Link} to="/info" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              <ListItem component={Link} to="/notifications" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>

              <ListItem component={Link} to="/dashboard/disaster-details" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Disaster Details" />
              </ListItem>
              <ListItem component={Link} to="/dashboard/disaster-categories" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Disaster Categories" />
              </ListItem>
              <ListItem component={Link} to="/dashboard/user-management" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItem>
            </List>
          </Box>

          {/* Logout Button */}
          <Box sx={{ padding: 2 }}>
            <Divider />
            <ListItem onClick={() => alert("Logout")} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>

            <ListItem component={Link} to="/settings" onClick={toggleSidebar} sx={{ '&:hover': { backgroundColor: '#B2EBF2' } }}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Content Area */}
      <Box sx={{ mt: 12, padding: 2, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
