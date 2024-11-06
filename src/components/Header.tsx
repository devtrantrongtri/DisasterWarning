import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Button, Tooltip } from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';
import { useLocation, Link, useNavigate} from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();  // Hook to handle programmatic navigation to other pages 

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Xác định tab đang hoạt động dựa trên đường dẫn hiện tại
  const getActiveTab = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header luôn cố định ở đầu */}
      <AppBar position="fixed" elevation={1} sx={{ height: 100, backgroundColor: '#d3f3ff' }}>
        <Toolbar>
          {/* Logo */}
          <IconButton edge="start" color="inherit" aria-label="logo">
            <Box
              component="img"
              src="https://cdn.pixabay.com/photo/2023/11/22/12/05/climate-change-8405380_1280.png"
              alt="Logo"
              sx={{ width: 80, height: 80, borderRadius: '50%' }}
            />
          </IconButton>

          {/* Navigation Buttons */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 2 }}>
              {/* Mai mot them logic hide */}
              <Button color="inherit" component={Link} to="/dashboard"
                sx={{
                  fontWeight: getActiveTab('/dashboard') ? 'bold' : 'normal',
                  color: getActiveTab('/dashboard') ? 'primary.main' : 'black',
                }}> 
                Admin Dashboard 
              </Button>

              <Button color="inherit" component={Link} to="/"
                sx={{
                  fontWeight: getActiveTab('/') ? 'bold' : 'normal',
                  color: getActiveTab('/') ? 'primary.main' : 'black',
                }}>
                Trang chủ
              </Button>

              {/*  Nút "Thiên tai" */}
              <Button color="inherit" component={Link} to="/disaster"
                sx={{
                  fontWeight: getActiveTab('/disaster') ? 'bold' : 'normal',
                  color: getActiveTab('/disaster') ? 'primary.main' : 'black',
                }}>
                Thiên tai
              </Button>

              {/* Các nút khác chỉ hiển thị nếu người dùng đã đăng nhập */}
              {isLoggedIn && (
                <>
                  <Button color="inherit" component={Link} to="/location"
                    sx={{
                      fontWeight: getActiveTab('/location') ? 'bold' : 'normal',
                      color: getActiveTab('/location') ? 'primary.main' : 'black',
                    }}>
                    Vị trí của bạn
                  </Button>

                  <Button color="inherit" component={Link} to="/support-info"
                    sx={{
                      fontWeight: getActiveTab('/support-info') ? 'bold' : 'normal',
                      color: getActiveTab('/support-info') ? 'primary.main' : 'black',
                    }}>
                    Thông tin cứu trợ
                  </Button>
                </>
              )}

              {/*  Nút "Thong Bao" */}
              <IconButton color="inherit" component={Link} to="/disaster-warning"
                sx={{
                  fontWeight: getActiveTab('/disaster-warning') ? 'bold' : 'normal',
                  color: getActiveTab('/disaster-warning') ? 'primary.main' : 'black',
                }}>
                  <Notifications />
              </IconButton>
          </Box>

          {/* Search Bar */}
          <Box sx={{ position: 'relative', borderRadius: '16px', backgroundColor: '#f1f1f1', ml: 2, p: '0 16px', display: 'flex', alignItems: 'center', maxWidth: 200 }}>
            <Search sx={{ color: '#757575', mr: 1 }} />
            <InputBase placeholder="Tìm kiếm..." />
          </Box>

          {/* Hiển thị nút "Đăng nhập" nếu chưa đăng nhập */}
           {/* onClick={() => setIsLoggedIn(true)} */}
          {!isLoggedIn ? ( 
            <Button component={Link} to="/auth" sx={{ ml: 2, color: 'black' }}> Đăng nhập </Button> 
          ) : (
            
            /* Hiển thị thông tin người dùng và nút Đăng xuất nếu đã đăng nhập */
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography sx={{ mr: 1, color: 'black'}}>Trần Đăng Nam</Typography>
              <IconButton edge="end" color="inherit" component={Link} to="/info">
                <Box
                  component="img"
                  src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/456515473_1160221798570101_6600422429005067164_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=00uOCDFmGhsQ7kNvgGBpuEJ&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=ATOo2aG5AfP3HZdec_nkuay&oh=00_AYDzAhzv0RrEproIa6iMWmXlcbxzlI62Zkn81F7xlMdgvA&oe=6730DCC6"
                  alt="User"
                  sx={{  height: 60, borderRadius: '50%', ml: 1 }}
                />
              </IconButton>
              <Button onClick={handleLogout} sx={{ ml: 1, color:'blue', fontWeight:'bold' }}>
                Đăng xuất
              </Button>
            </Box>
          )}

        </Toolbar>
      </AppBar>

      {/* Tạo khoảng trống bên dưới header để tránh che khuất nội dung */}
      <Toolbar />
    </>
  );
};

export default Header;
