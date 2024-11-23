package disasterwarning.com.vn.services.sendMail;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Objects;

@Service
public class MailService implements IMailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendMail(String to, DisasterWarningDTO disasterWarningDTO) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Cảnh Báo Thiên Tai: " + disasterWarningDTO.getDisaster().getDisasterName());

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String startDateFormatted = dateFormat.format(disasterWarningDTO.getStartDate());
            String imagePath = getString(disasterWarningDTO);

            String content = "<body style=\"margin: 0; padding: 20px; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;\">\n" +
                    "  <div class=\"card\" style=\"width: 90%; max-width: 600px; margin: 20px auto; padding: 30px; background: linear-gradient(135deg, #f5eaea 0%, #ccd9ed 100%); border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);\">\n" +
                    "    <div class=\"header\" style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;\">\n" +
                    "      <div class=\"warning\" style=\"display: flex; align-items: center; gap: 12px;\">\n" +
                    "        <span class=\"notification-text\" style=\"font-size: 28px; font-weight: 700; color: #e63946;\">Warning</span>\n" +
                    "        <img src=\"https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731118524/icons8-warning-100_v8eduo.png\" alt=\"warning\" style=\"width: 35px; height: 35px;\">\n" +
                    "        <div class=\"notification-dot\" style=\"width: 10px; height: 10px; background-color: #ff4040; border-radius: 50%; box-shadow: 0 0 6px rgba(255, 64, 64, 0.6);\"></div>\n" +
                    "      </div>\n" +
                    "      <div class=\"logo-container\" style=\"padding: 4px;\">\n" +
                    "        <img src=\"https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731037464/logo_ofexva.png\" alt=\"Logo\" style=\"width: 70px; height: 70px; object-fit: contain;\">\n" +
                    "      </div>\n" +
                    "    </div>\n" +
                    "\n" +
                    "    <div class=\"content\" style=\"display: flex; gap: 24px; align-items: start; background-color: rgba(255, 255, 255, 0.5); padding: 20px; border-radius: 12px;\">\n" +
                    "      <img src=\""+ imagePath +"\" alt=\"Disaster Image\" style=\"width: 160px; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);\">\n" +
                    "      <div class=\"info\" style=\"flex-grow: 1;\">\n" +
                    "        <h2 style=\"font-size: 22px; font-weight: bold; margin: 0 0 12px 0; color: #1a1a1a; line-height: 1.3;\">CẢNH BÁO THIÊN TAI: " + disasterWarningDTO.getDisaster().getDisasterName() + "</h2>\n" +
                    "        <p style=\"color: #444; font-size: 16px; margin: 0 0 12px 0; line-height: 1.4;\">\n" +
                    "          <strong style=\"color: #2b2b2b;\">Thời gian: </strong>"+ startDateFormatted +"\n" +
                    "        </p>\n" +
                    "        <p style=\"color: #444; margin: 0; line-height: 1.6;\">\n" +
                    "          <strong style=\"color: #2b2b2b;\">Mô tả: </strong>"+ disasterWarningDTO.getDescription() +".\n" +
                    "          <br><br>\n" +
                    "          <em style=\"color: #666; font-style: italic;\">Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.</em>\n" +
                    "        </p>\n" +
                    "      </div>\n" +
                    "    </div>\n" +
                    "  </div>\n" +
                    "</body>";


            helper.setText(content, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private static String getString(DisasterWarningDTO disasterWarningDTO) {
        String imagePath = "";
        if (Objects.equals(disasterWarningDTO.getDisaster().getDisasterName(), "Lũ lụt")) {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731133125/9_ghdlpy.png";
        } else if (Objects.equals(disasterWarningDTO.getDisaster().getDisasterName(), "Bão")) {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731133123/8_zg2bkm.png";
        } else if (Objects.equals(disasterWarningDTO.getDisaster().getDisasterName(), "Lốc xoáy")) {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731133123/6_ypbgvj.png";
        } else if (Objects.equals(disasterWarningDTO.getDisaster().getDisasterName(), "Sương mù")) {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731133122/7_kz27et.png";
        } else if (Objects.equals(disasterWarningDTO.getDisaster().getDisasterName(), "Áp thấp nhiệt đới")) {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731135583/tropical_thiwdl.png";
        } else {
            imagePath = "https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731134246/VIet_NAm_Logo_1400_x_1350_px_2_ruv6sb.png";
        }
        return imagePath;
    }
}