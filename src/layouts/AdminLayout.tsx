import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet, Link } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={isSidebarOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 250 : 72,
            overflowX: 'hidden',
            backgroundColor: isSidebarOpen ? '#2D3A54' : 'transparent',
            color: 'white',
            transition: 'width 0.3s ease, backgroundColor 0.8s ease',
            
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Sidebar Header (Menu Icon) */}
          <Box>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                width: '100%',
                // padding: '16px 0',
                borderRadius:0,
                '&:hover': { backgroundColor: '#B2EBF2', color: '#2D3A54' },
              }}
            >
              {isSidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
            </IconButton>

            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: 'bold',
                fontSize: '25px',
                p: '6px 0',
                display: isSidebarOpen ? 'block' : 'none',
              }}
            >
              Disaster Warning
            </Typography>
            <Divider sx={{ borderColor: 'white' }} />
          </Box>

          {/* Sidebar Items */}
          <List sx={{ mt: isSidebarOpen ? '1.5vh' : '1.5vh' }}>
            {[
              { text: 'Home', icon: <HomeIcon />, path: '/' },
              { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
              { text: 'Profile', icon: <AccountCircleIcon />, path: '/info' },
              { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
              { text: 'Disaster Details', icon: <InfoIcon />, path: '/dashboard/disaster-details' },
              { text: 'Disaster Categories', icon: <CategoryIcon />, path: '/dashboard/disaster-categories' },
              { text: 'User Management', icon: <PeopleIcon />, path: '/dashboard/user-management' },
              { text: 'User Management', icon: <WarningAmberIcon />, path: '/dashboard/disaster-warning' },
            ].map((item) => (
              <Tooltip title={isSidebarOpen ? '' : item.text} key={item.text} placement="right">
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    if (!isSidebarOpen) setSidebarOpen(true);
                  }}
                  sx={{
                    pl: '1.5vw',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#B2EBF2',
                      color: '#2D3A54',
                      '& .MuiListItemIcon-root': { color: '#2D3A54' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  {isSidebarOpen && <ListItemText primary={item.text} />}
                </ListItem>
              </Tooltip>
            ))}
          </List>

          {/* Logout and Settings */}
          <Box sx={{ mb: '3vh' }}>
            <Divider sx={{ borderColor: 'white', mb: '3vh' }} />
            <ListItem
              onClick={() => alert('Logout')}
              sx={{
                pl: '1.5vw',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#B2EBF2',
                  color: '#2D3A54',
                  '& .MuiListItemIcon-root': { color: '#2D3A54' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <LogoutIcon />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Logout" />}
            </ListItem>

            <ListItem
              component={Link}
              to="/settings"
              onClick={toggleSidebar}
              sx={{
                pl: '1.5vw',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#B2EBF2',
                  color: '#2D3A54',
                  '& .MuiListItemIcon-root': { color: '#2D3A54' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SettingsIcon />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Settings" />}
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Content Area */}
      <Box sx={{ mt: 12, padding: 2, pl:6, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
