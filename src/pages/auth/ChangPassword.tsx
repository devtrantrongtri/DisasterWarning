import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useChangePasswordMutation } from '../../services/user.service'; // Adjust this import based on your file structure

interface ChangePasswordPopupProps {
  onClose: () => void;
}

const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    retypePassword: '',
  });

  // Call the mutation hook
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,  // Directly update fields in formData
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { oldPassword, password, retypePassword } = formData;

    // Check if the fields are filled out properly
    if (!oldPassword || !password || !retypePassword) {
      alert('Vui lòng điền đầy đủ các trường yêu cầu.');
      return;
    }

    // Check if the new password and confirmation password match
    if (password !== retypePassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    // Prepare the data for mutation
    const changePasswordData = {
        oldPassword,
        password,
        retypePassword,
    };

    try {

      // Call the mutation to change the password with token in the Authorization header
      await changePassword(changePasswordData).unwrap();

      // Close the popup after successful submission
      onClose();
    } catch (err) {
      // Handle any errors that occur during the mutation
      console.error('Error changing password:', err);
      alert('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Thay đổi mật khẩu</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Mật khẩu cũ"
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              name="retypePassword"
              value={formData.retypePassword}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Hủy
              </Button>
              <Button type="submit" color="primary" variant="contained" disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChangePasswordPopup;
