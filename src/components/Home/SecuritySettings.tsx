import { Box, Typography, Switch, FormControlLabel, Button } from '@mui/material';

const SecuritySettings = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Cài đặt bảo mật</Typography>
    <FormControlLabel
      control={<Switch />}
      label="Xác thực hai bước"
    />
    <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
      Cập nhật câu hỏi bảo mật
    </Button>
  </Box>
);

export default SecuritySettings;
