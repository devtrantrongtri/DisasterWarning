import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Button, Avatar } from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { notification, Modal } from 'antd'; // Import Ant Design
import Logo from './Logo';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../stores/slices/user.slice';
import { RootState } from '../interfaces/StoreTypes';

const Header = () => {
  // const isAuthen = useSelector((state: RootState) => state.user.isAuthen);
  // const userName = useSelector((state: RootState) => state.user.userName);
  // const roleName = useSelector((state : RootState) => state.user.role);

  const isAuthen = localStorage.getItem('isAuthen');
  const userName = localStorage.getItem('userName');
  const roleName = localStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hàm xử lý khi người dùng xác nhận đăng xuất
  const confirmLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userID');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthen');
    sessionStorage.removeItem('token');
    navigate('/'); // Chuyển hướng đến trang chủ
    notification.success({
      message: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất khỏi hệ thống.',
      placement: 'top'
    });
  };

  // Hiển thị hộp thoại xác nhận đăng xuất
  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: confirmLogout, // Gọi hàm xác nhận đăng xuất
      okButtonProps: { style: { backgroundColor: '#4CAF50', color: 'white', fontWeight:'bold'  } }, // Nút Đồng ý
      cancelButtonProps: { style: { color: '#FF5733', fontWeight:'bold' } }, // Nút Hủy
    });
  };

  // Xác định tab đang hoạt động dựa trên đường dẫn hiện tại
  const getActiveTab = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ height: 100, backgroundColor: '#2d3a54' }}>
        <Toolbar>
          {/* Logo */}
          <IconButton edge="start" color="inherit" aria-label="logo">
            <Logo />
          </IconButton>

          {/* Navigation Buttons */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 4, ml: 2 }}>

            { roleName === "[ROLE_ADMIN]" &&(
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              sx={{
                fontWeight: getActiveTab('/dashboard') ? 'bold' : 'normal',
                color: getActiveTab('/dashboard') ? '#B0E2FF' : '#e6eff5',
                fontSize: '1rem',
              }}
            >
              Admin Dashboard
            </Button>
            )}

            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                fontWeight: getActiveTab('/') ? 'bold' : 'normal',
                color: getActiveTab('/') ? '#CAE1FF' : '#e6eff5',
                fontSize: '1rem',
              }}
            >
              Trang chủ
            </Button>

            {/* Nút "Thiên tai" */}
            <Button
              color="inherit"
              component={Link}
              to="/disaster"
              sx={{
                fontWeight: getActiveTab('/disaster') ? 'bold' : 'normal',
                color: getActiveTab('/disaster') ? '#B0E2FF' : '#e6eff5',
                fontSize: '1rem',
              }}
            >
              Thiên tai
            </Button>

            {/* Các nút khác chỉ hiển thị nếu người dùng đã đăng nhập */}
            {isAuthen && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/location"
                  sx={{
                    fontWeight: getActiveTab('/location') ? 'bold' : 'normal',
                    color: getActiveTab('/location') ? '#B0E2FF' : '#e6eff5',
                    fontSize: '1rem',
                  }}
                >
                  Vị trí của bạn
                </Button>

                <Button
                  color="inherit"
                  component={Link}
                  to="/support-info"
                  sx={{
                    fontWeight: getActiveTab('/support-info') ? 'bold' : 'normal',
                    color: getActiveTab('/support-info') ? '#B0E2FF' : '#e6eff5',
                    fontSize: '1rem',
                  }}
                >
                  Thông tin cứu trợ
                </Button>
              </>
            )}
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '16px',
              backgroundColor: '#f1f1f1',
              ml: 2,
              p: '0 16px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 250,
            }}
          >
            <Search sx={{ color: '#757575', mr: 1 }} />
            <InputBase placeholder="Tìm kiếm..." />
          </Box>

          {/* Nút "Thông Báo" */}
          <IconButton
            color="inherit"
            component={Link}
            to="/disaster-warning"
            sx={{
              fontWeight: getActiveTab('/disaster-warning') ? 'bold' : 'normal',
              color: getActiveTab('/disaster-warning') ? '#B0E2FF' : '#e6eff5',
              fontSize: '1rem',
            }}
          >
            <Notifications />
          </IconButton>

          {/* Hiển thị nút "Đăng nhập" nếu chưa đăng nhập */}
          {!isAuthen || isAuthen !== 'true'  ? (
            <Button
              component={Link}
              to="/auth"
              sx={{ ml: 2, color: '#e6eff5', fontSize: '1rem' }}
            >
              Đăng nhập
            </Button>
          ) : (
            /* Hiển thị thông tin người dùng và nút Đăng xuất nếu đã đăng nhập */
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, fontSize: '1rem' }}>
              <Typography sx={{ mr: 1, color: '#e6eff5' }}>{userName}</Typography>
              <IconButton edge="end" color="inherit" component={Link} to="/info">
                <Avatar sx={{ bgcolor: '' }}>{userName ? userName.charAt(0).toUpperCase() : ''}</Avatar>
              </IconButton>
              <Button onClick={handleLogout} sx={{ ml: 1, color: '#E6EFF5', fontWeight: 'bold', fontSize: '1rem' }}>
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
