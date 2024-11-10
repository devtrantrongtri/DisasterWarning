import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
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
      <TextField
        label="Địa chỉ Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSendOtp}
        disabled={isLoading}
      >
        {isLoading ? 'Đang gửi OTP...' : 'Lấy mã OTP'}
      </Button>
      <Button component={Link} to="/auth" variant="text" sx={{ mt: 2 }}>
        ← Quay lại đăng nhập
      </Button>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
