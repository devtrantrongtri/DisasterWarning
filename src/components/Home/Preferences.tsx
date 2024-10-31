import { Box, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';

const Preferences = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Cài đặt sở thích</Typography>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Ngôn ngữ</InputLabel>
      <Select defaultValue="vi">
        <MenuItem value="vi">Tiếng Việt</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </FormControl>
    <FormControlLabel
      control={<Switch />}
      label="Thông báo qua Email"
    />
  </Box>
);

export default Preferences;
