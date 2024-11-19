import React, { useState } from 'react';
import { Button, TextField, Box} from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSendOtpMutation } from '../../services/user.service';
import { setGmail } from '../../stores/slices/user.slice';
import { notification } from 'antd';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await sendOtp(email).unwrap();
      console.log("Response:", response); // Kiểm tra phản hồi
      dispatch(setGmail(email)); // Lưu email vào slice
      notification.success({
        message: 'Yêu cầu OTP thành công',
        description: 'Mã OTP đã được gửi đến email của bạn.',
        duration: 3,
        placement: 'top',
      });
      navigate('/auth/verification-code'); // Điều hướng đến trang mã xác thực
    } catch (error) {
      console.error('Error:', error); // In ra lỗi
      notification.error({
        message: 'Yêu cầu OTP thất bại',
        description: 'Vui lòng kiểm tra lại email.',
        duration: 3,
        placement: 'top',
      });
    }
  };
  

  return (
    <AuthLayout title="Quên mật khẩu? 🤔" subtitle="Đừng lo, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn">
      <Box sx={{ mt: 2, px: 5, py: 5, borderRadius: 2, boxShadow: 3, backdropFilter: 'blur(20px)' }}>
        <TextField
          label="Địa chỉ Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#dce9f5',
              },
              '&:hover fieldset': {
                borderColor: '#e5e5e5',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#e5e5e5',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#e5e5e5', // Đổi màu label
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#e5e5e5', // Đổi màu label khi có focus
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendOtp}
          disabled={isLoading}
          sx={{
            mt: 3,
            py: 1.2,
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#f7fafc',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: '#e2e8f0',
            },
          }}
        >
          {isLoading ? 'Đang gửi OTP...' : 'Lấy mã OTP'}
        </Button>
        <Button component={Link} to="/auth" variant="text" sx={{ mt: 2, color: '#e5e5e5' }}>
          ← Quay lại đăng nhập
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
