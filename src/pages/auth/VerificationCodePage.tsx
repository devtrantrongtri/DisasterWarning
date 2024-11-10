import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../interfaces/StoreTypes';
import { useSendOtpMutation } from '../../services/user.service';
import { notification } from 'antd';

const VerificationCodePage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0); // Trạng thái để đếm ngược 30 giây
  const navigate = useNavigate();
  
  // Lấy email từ Redux store
  const email = useSelector((state: RootState) => state.user.email);
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  // Đặt subtitle ban đầu với email
  const [subtitle, setSubtitle] = useState<string | React.ReactNode>(
    <>
      Chúng tôi vừa gửi mã xác thực đến{' '}
      <Typography component="span" fontWeight="bold">
        {email || 'email của bạn'}
      </Typography>
    </>
  );

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

  const handleVerifyCode = () => {
    if (otp === '1111') { // Kiểm tra OTP (ví dụ: mã đúng là '1111')
      setSubtitle('Đã xác thực thành công');
      navigate('/auth/reset-password');
    } else {
      setSubtitle('Xác thực không thành công');
    }
  };

  const handleResend = async () => {
    if (email) {
      try {
        await sendOtp(email).unwrap();
        notification.success({
          message: 'Mã OTP đã được gửi lại',
          description: `Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra.`,
          duration: 3,
          placement: 'top',
        });
        setTimer(30); // Đặt lại bộ đếm 30 giây
      } catch (error) {
        notification.error({
          message: 'Gửi lại OTP thất bại',
          description: 'Vui lòng thử lại sau.',
          duration: 3,
          placement: 'top',
        });
      }
    }
  };

  useEffect(() => {
    let countdown: ReturnType<typeof setTimeout>;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  return (
    <AuthLayout title="Nhập mã xác thực" subtitle={subtitle}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <MuiOtpInput
          value={otp}
          onChange={handleChange}
          length={4}
          validateChar={(value) => /\d/.test(value)} // Chỉ chấp nhận số
          autoFocus
          TextFieldsProps={{
            variant: 'outlined',
            sx: {
              width: '64px',
              height: '64px',
              marginRight: '8px',
              '& .MuiInputBase-input': {
                textAlign: 'center',
                fontSize: '24px',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
                },
              },
            },
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleVerifyCode}
      >
        Xác thực
      </Button>
      <Button
        variant="text"
        onClick={handleResend}
        fullWidth
        sx={{ mt: 2 }}
        disabled={timer > 0 || isLoading} // Vô hiệu hóa nếu timer > 0 hoặc đang gửi
      >
        {timer > 0 ? `Gửi lại mã trong ${timer}s` : 'Gửi lại mã'}
      </Button>
    </AuthLayout>
  );
};

export default VerificationCodePage;
