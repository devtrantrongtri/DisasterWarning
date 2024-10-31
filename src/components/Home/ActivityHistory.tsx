import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ActivityHistory = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Lịch sử hoạt động</Typography>
    <List>
      <ListItem>
        <ListItemText primary="Đăng nhập" secondary="Ngày 01/11/2024 - Thành công" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Thay đổi mật khẩu" secondary="Ngày 30/10/2024 - Thành công" />
      </ListItem>
      {/* Thêm các lịch sử hoạt động khác */}
    </List>
  </Box>
);

export default ActivityHistory;
