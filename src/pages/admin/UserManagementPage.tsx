import React from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

// Giả lập dữ liệu người dùng
const users = [
  {
    id: 1,
    username: 'user01',
    email: 'user01@example.com',
    location: 'Coordinates and location',
    status: 'safe', // Hoặc "disaster"
  },
  {
    id: 2,
    username: 'user02',
    email: 'user02@example.com',
    location: 'Coordinates and location',
    status: 'disaster', // Hoặc "safe"
  },
];

const UserManagementPage: React.FC = () => {
  const handleSendAlert = (userId: number) => {
    // Giả lập hành động gửi cảnh báo
    console.log(`Cảnh báo đã được gửi cho người dùng ID: ${userId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Last Known Location</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      padding: 1,
                      color: '#fff',
                      borderRadius: 1,
                      textAlign: 'center',
                      backgroundColor:
                        user.status === 'safe' ? 'green' : 'red',
                    }}
                  >
                    {user.status === 'safe' ? 'An toàn' : 'Thiên tai'}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary">
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<WarningIcon />}
                    onClick={() => handleSendAlert(user.id)}
                    sx={{ marginLeft: 1 }}
                  >
                    Tạo cảnh báo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagementPage;
