package disasterwarning.com.vn.services;

import jakarta.mail.MessagingException;

import java.io.IOException;

public interface IPasswordService{

    public void verifyEmailAndSendOTP(String email) throws MessagingException, IOException;

    public void verifyOTP(String email, Integer otp);
}
