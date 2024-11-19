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

  // const getActiveTab = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          height: 100,
          backgroundColor: 'transparent',
          color: '#ffffff',
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
            <Button color="inherit" component={Link} to="/" sx={{ fontSize: '1.1rem', fontWeight: '600', }}>
              Trang chủ
            </Button>
          </Typography>

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{ '& .MuiDrawer-paper': { width: 250, backgroundColor: '#2D3A54', color:'white', minWidth:'40vh' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Sidebar Items */}
          <Box>
            <Typography variant="h6" align="center" sx={{fontWeight:'bold', fontSize:'25px', p: '30px 0'}}>
              Disaster Warning
            </Typography>
            <Divider sx={{borderColor:'white'}}/>
            <List sx={{mt: '5vh'}}>
              <ListItem component={Link} to="/dashboard" onClick={toggleSidebar} sx={{ pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' }} }}>
                <ListItemIcon sx={{color:'white'}}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem component={Link} to="/info" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
                <ListItemIcon sx={{color:'white'}}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              <ListItem component={Link} to="/notifications" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
                <ListItemIcon sx={{color:'white'}}>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>

              <ListItem component={Link} to="/dashboard/disaster-details" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
                <ListItemIcon sx={{color:'white'}}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Disaster Details" />
              </ListItem>
              <ListItem component={Link} to="/dashboard/disaster-categories" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
                <ListItemIcon sx={{color:'white'}}>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Disaster Categories" />
              </ListItem>
              <ListItem component={Link} to="/dashboard/user-management" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
                <ListItemIcon sx={{color:'white'}}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItem>
            </List>
          </Box>

          {/* Logout Button */}
          <Box sx={{mb:'3vh'}}>
            <Divider sx={{borderColor:'white', mb:'3vh'}}/>
            <ListItem onClick={() => alert("Logout")} sx={{pl: '2vw',color:'white',cursor:'pointer', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
              <ListItemIcon sx={{color:'white'}}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>

            <ListItem component={Link} to="/settings" onClick={toggleSidebar} sx={{pl: '2vw',color:'white', '&:hover': { backgroundColor: '#B2EBF2', color:'#2D3A54' , '& .MuiListItemIcon-root': { color: '#2D3A54' } } }}>
              <ListItemIcon sx={{color:'white'}}>
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
