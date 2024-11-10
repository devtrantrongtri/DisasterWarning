import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../interfaces/StoreTypes';

/**
 * 
 * @TODO 
 *  chinh sua api verify otp
 *  them api verify otp
 *  lay email tu store 
 *  
 */

const VerificationCodePage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  // Lấy email từ Redux store
  const email = useSelector((state: RootState) => state.user.email);
  
  // Cập nhật subtitle với email từ store
  const [subtitle, setSubtitle] = useState<string | React.ReactNode >(
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
    setSubtitle("da xac thuc thanh cong :" + otp)
    if(otp == "1111") {
      navigate('/auth/reset-password')
    }else{
      setSubtitle("Xac thuc khong thanh cong" + otp)
    }
    // alert("Da gui otp : " + otp);
  };

  const handleResend = () => {
    setOtp('');
    // Add resend code logic o day
  };

  return (
    <AuthLayout
      title="Enter Verification Code"
      subtitle={subtitle}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <MuiOtpInput
          value={otp}
          onChange={handleChange}
          length={4}
          validateChar={(value) => /\d/.test(value)} // Chỉ chấp nhận số
          // onComplete={ handleVerifyCode}
          autoFocus
          TextFieldsProps={{
            variant: 'outlined',
            sx: {
              width: '64px', // Tăng chiều rộng
              height: '64px', // Tăng chiều cao
              marginRight: '8px',
              '& .MuiInputBase-input': {
                textAlign: 'center',
                fontSize: '24px', // Tăng kích thước chữ
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  // Thêm bóng bên trong
                  boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
                },
              },
            },
          }}
        />
      </Box>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleVerifyCode}> 
        Verify
      </Button>
      <Button variant="text" onClick={handleResend} fullWidth sx={{ mt: 2 }}>
        Resend Code
      </Button>
    </AuthLayout>
  );
};

export default VerificationCodePage;
