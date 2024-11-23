import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Collapse,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useCreateLocationMutation,
  useGetUserByIdQuery,
  useGetCreateWarningQuery,
} from '../../services/user.service';
import { User } from '../../interfaces/AuthType';
import CitySelector from '../../components/Admin/CitySelector';
import { City } from '../../interfaces/WeatherType';

const UserManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const size = 5;
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number; name?: string } | null>(null);
  const [locationOptionSelected, setLocationOptionSelected] = useState(false);

  const [showWarning, setShowWarning] = useState(false); // State to control when to call the warning API

  const { data, isLoading, isError, refetch } = useGetUsersQuery({ page: page - 1, size });
  const [updateUser] = useUpdateUserMutation();
  const [createLocation] = useCreateLocationMutation();

  // Use skip to control when to call the warning API
  const {
    data: warningData,
    isLoading: warningLoading,
    isError: warningError,
    refetch: refetchWarning,
  } = useGetCreateWarningQuery(null, {
    skip: !showWarning,
  });

  // Fetch user data when opening the edit dialog
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(selectedUserId!, {
    skip: selectedUserId === null,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (userData) {
      setSelectedUser(userData.data);
    }
  }, [userData, openLocationDialog]);

  // Handle the "Tạo cảnh báo ?" button click
  const handleCreateWarning = () => {
    setShowWarning(true);
    refetchWarning(); // Fetch the warning data
  };

  // Close the warning data display
  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const handleOpenEditDialog = (userId: number) => {
    setSelectedUserId(userId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUserId(null);
    setSelectedUser(null);
    setCoordinates(null);
    setLocationOptionSelected(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    console.log('f :', selectedUser.location);
    let locationId = selectedUser.location?.locationId || null;

    if (coordinates) {
      try {
        const locationResponse = await createLocation({
          locationName: coordinates.name ? coordinates.name : `${selectedUser.userName}'s location`,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }).unwrap();

        locationId = locationResponse.data.locationId;
      } catch (err) {
        console.error('Lỗi khi tạo địa điểm:', err);
        setNotification({
          open: true,
          message: 'Không thể tạo địa điểm. Vui lòng thử lại.',
          severity: 'error',
        });
        return;
      }
    }

    try {
      await updateUser({
        userId: selectedUser.userId,
        userName: selectedUser.userName,
        email: selectedUser.email,
        password: selectedUser.password,
        role: selectedUser.role,
        status: selectedUser.status,
        location: locationId ? { locationId } : selectedUser.location,
      }).unwrap();

      setNotification({
        open: true,
        message: 'Cập nhật người dùng thành công!',
        severity: 'success',
      });
      handleCloseEditDialog();
      refetch(); // Reload the user list after updating
    } catch (error) {
      console.error('Error updating user:', error);
      setNotification({
        open: true,
        message: 'Cập nhật thất bại. Vui lòng thử lại.',
        severity: 'error',
      });
    }
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle location selection
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationOptionSelected(true);
          setOpenLocationDialog(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng thử phương thức khác.');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Geolocation.');
    }
  };

  const handleCitySelect = (city: City) => {
    setCoordinates({
      latitude: city.coord.lat,
      longitude: city.coord.lon,
      name: city.name,
    });
    setLocationOptionSelected(true);
    setOpenLocationDialog(false);
  };

  if (isLoading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (isError || !data) return <Typography>Có lỗi xảy ra khi tải dữ liệu.</Typography>;

  const users = data.data.content as User[];
  const totalPages = data.data.totalPages;

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 4,
        marginBottom: 2,
        textAlign: 'center',
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        color: '#030302',
        marginTop: -9,
      }}
    >
      {/* "Tạo cảnh báo ?" Button */}
      <Button
        variant="contained"
        color="warning"
        startIcon={<WarningIcon />}
        sx={{
          padding: 1,
          borderRadius: 1,
          background: '#CC0000',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          color: '#fff',
          transition: 'background 0.3s, color 0.3s',
          '&:hover': {
            background: '#f0f0f0',
            color: '#000',
          },
          mb: 2,
        }}
        onClick={handleCreateWarning}
      >
        Tạo cảnh báo ?
      </Button>

      {/* Display warning data when available */}
      {showWarning && (
        <Box
          sx={{
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#fff3cd',
            color: '#856404',
            mb: 2,
          }}
        >
          {warningLoading && <Typography>Đang tải cảnh báo...</Typography>}
          {warningError && <Typography>Có lỗi xảy ra khi tải cảnh báo.</Typography>}
          {warningData && (
            <Box>
              {/* Adjust the rendering based on the structure of warningData */}
              <Typography variant="h6">Dữ liệu cảnh báo:</Typography>
              {/* Assuming warningData is an array */}
              {warningData.data && warningData.data.length > 0 ? (
                warningData.data.map((warning: any, index: number) => (
                  <Typography key={index}>{warning.message}</Typography>
                ))
              ) : (
                <Typography>Không có cảnh báo nào.</Typography>
              )}
            </Box>
          )}
          <Button variant="text" onClick={handleCloseWarning} sx={{ mt: 1 }}>
            Đóng
          </Button>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          padding: 3,
          borderRadius: 4,
          marginBottom: 2,
          textAlign: 'center',
          background: 'transparent',
          minHeight: '440px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }} />
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên người dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vị trí cuối cùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tình trạng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user.userId}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpenRow(openRow === user.userId ? null : user.userId)}
                    >
                      {openRow === user.userId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.userId}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.userName}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    {user.location
                      ? `${user.location.locationName} (${user.location.latitude}, ${user.location.longitude})`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        padding: 1,
                        borderRadius: 4,
                        background: '#0066CC',
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center',
                        color: '#fff',
                        transition: 'background 0.3s, color 0.3s',
                        '&:hover': {
                          background: '#fff',
                          color: '#0066CC',
                        },
                      }}
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(user.userId)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary">
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<WarningIcon />}
                      sx={{
                        padding: 1,
                        borderRadius: 1,
                        background: '#CC0000',
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center',
                        color: '#fff',
                        transition: 'background 0.3s, color 0.3s',
                        '&:hover': {
                          background: '#f0f0f0',
                          color: '#000',
                        },
                      }}
                    >
                      Tạo cảnh báo
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openRow === user.userId} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Thông tin chi tiết
                        </Typography>
                        <Box display="flex" flexDirection="column" sx={{ '& > *': { marginBottom: 1 } }}>
                          <Typography>
                            <strong>Vai trò:</strong> {user.role}
                          </Typography>
                          <Typography>
                            <strong>Trạng thái:</strong> {user.status}
                          </Typography>
                          <Typography>
                            <strong>Địa chỉ:</strong> {user.location?.locationName || 'N/A'}
                          </Typography>
                          <Typography>
                            <strong>Vĩ độ:</strong> {user.location?.latitude || 'N/A'}
                          </Typography>
                          <Typography>
                            <strong>Kinh độ:</strong> {user.location?.longitude || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
      </Box>

      {/* Dialog chỉnh sửa người dùng */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          textAlign: 'center',
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 2,
            padding: 3,
            backgroundColor: '#ffffff',
            borderRadius: 4,
            marginBottom: 2,
            textAlign: 'center',
            background: 'transparent',
            backdropFilter: 'blur(10px)',
            color: '#0066CC',
            boxShadow: 'none',
            fontWeight: 'bold',
          }}
        >
          Chỉnh sửa thông tin
        </DialogTitle>
        <DialogContent>
          {isUserLoading ? (
            <Typography>Đang tải thông tin người dùng...</Typography>
          ) : isUserError ? (
            <Typography>Có lỗi xảy ra khi tải thông tin người dùng.</Typography>
          ) : selectedUser ? (
            <>
              <TextField
                label="Tên người dùng"
                fullWidth
                margin="dense"
                value={selectedUser.userName || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="dense"
                value={selectedUser.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              {/* <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="dense"
                value={selectedUser.password || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
              /> */}
              <TextField
                label="Vai trò"
                fullWidth
                margin="dense"
                value={selectedUser.role || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              />
              <TextField
                label="Trạng thái"
                fullWidth
                margin="dense"
                value={selectedUser.status || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              />

              {/* Nút chọn địa điểm */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenLocationDialog(true)}
                sx={{
                  mt: 2,
                  color: locationOptionSelected ? 'primary.main' : 'text.secondary',
                  fontWeight: locationOptionSelected ? 'bold' : 'normal',
                  backgroundColor: locationOptionSelected ? 'background.default' : 'transparent',
                  ':hover': { bgcolor: 'primary.light' },
                }}
              >
                {locationOptionSelected ? 'Địa điểm đã chọn' : 'Chọn phương thức cung cấp địa điểm'}
              </Button>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog để chọn địa điểm */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
          Chọn Phương Thức Địa Điểm
        </DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            onClick={handleUseCurrentLocation}
            fullWidth
            sx={{ my: 2, py: 1.5, fontSize: '1rem' }}
          >
            Sử dụng vị trí hiện tại
          </Button>
          <Divider>Hoặc</Divider>
          <CitySelector onCitySelect={handleCitySelect} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenLocationDialog(false)} color="secondary" variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagementPage;
