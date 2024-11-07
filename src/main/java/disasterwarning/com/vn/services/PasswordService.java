package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.entities.User;
import disasterwarning.com.vn.repositories.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
public class PasswordService implements IPasswordService {

    private final UserRepo userRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;


    private final Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

    @Override
    public void verifyEmailAndSendOTP(String email) throws MessagingException, IOException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }

        String otp = otpGenerator(6);

        OTPData otpData = new OTPData(otp, new Date(System.currentTimeMillis() + 60 * 1000));
        otpStorage.put(email, otpData);

        System.out.println("Đã lưu OTP: " + otp + " cho email: " + email);

        sendOtpMail(user.getEmail(), otp);

        executorService.schedule(() -> otpStorage.remove(email), 60, TimeUnit.SECONDS);
    }

    @Override
    public void verifyOTP(String email, Integer otp) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm tháy người dùng có email: " + email);
        }

        OTPData otpData = otpStorage.get(email);
        if (otpData != null) {
            System.out.println("OTP từ otpStorage: " + otpData.getOtp() + " cho email: " + email);

            if (otpData.getOtp().equals(otp.toString())) {
                if (otpData.getExpirationTime().before(new Date())) {
                    throw new RuntimeException("Mã OTP đã hết hạn!");
                }

                otpStorage.remove(email); //Xóa OTP sau khi xác minh thành công
                System.out.println("Xác minh OTP thành công cho email: " + email);
            } else {
                throw new RuntimeException("Mã OTP không hợp lệ cho email: " + email);
            }
        } else {
            throw new RuntimeException("Không tìm thấy OTP hợp lệ cho email: " + email);
        }
    }

    private String otpGenerator(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }

    private void sendOtpMail(String to, String otp) throws MessagingException, IOException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true for HTML

        helper.setTo(to);
        helper.setSubject("Verify your OTP");

        String logoSrc = "../";

        String emailContent = "<body style=\"display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f2f2f2; font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box;\">\n" +
                            "    <div style=\"background-color: #fff; padding: 30px; width: 320px; text-align: center; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\">\n" +
                            "        <img src=\"" + logoSrc + "\" alt=\"Logo\" style=\"border-radius: 50%; padding: 10px; width: 150px; height: 150px; margin: 0 auto 20px; display: block;\">\n" +
                            "        <h1 style=\"font-size: 24px; color: #333; margin-bottom: 15px;\">Mã Xác Thực</h1>\n" +
                            "        <p>Đây là mã OTP quên mật khẩu của bạn:</p>\n" +
                            "        <div style=\"background-color: #f8f8f8; padding: 15px; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #3676CA; margin: 20px 0;\">" + otp + "</div>\n" +
                            "        <p style=\"font-size: 14px; color: #666; line-height: 1.5;\"> Nếu bạn không phải là người gửi yêu cầu này, hãy đổi mật khẩu tài khoản ngay lập tức để tránh việc bị truy cập trái phép. </p>\n" +
                            "    </div>\n" +
                            "</body>";

        helper.setText(emailContent, true);
        emailSender.send(message);
    }

    private static class OTPData {
        private final String otp;
        private final Date expirationTime;

        public OTPData(String otp, Date expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }

        public String getOtp() {
            return otp;
        }

        public Date getExpirationTime() {
            return expirationTime;
        }
    }
}
