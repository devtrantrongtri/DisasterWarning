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

            String content = "<body style=\"display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;\">\n" +
                            "  <div class=\"card\" style=\"width: 100%; max-width: 600px; padding: 24px; background: linear-gradient(135deg, #f5eaea 0%, #ccd9ed 100%); border-radius: 24px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);\">\n" +
                            "    <div class=\"header\" style=\"display: flex; justify-content: space-between; align-items: center; margin: 0; border-radius: 16px;\">\n" +
                            "      <div class=\"warning\" style=\"display: flex; align-items: center; gap: 8px;\">\n" +
                            "        <span class=\"notification-text\" style=\"font-size: 25px; font-weight: 600; color: #333;\">Warning</span>\n" +
                            "        <img src=\"https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731118524/icons8-warning-100_v8eduo.png\" alt=\"warning\" style=\"width: 30px;\">\n" +
                            "        <div class=\"notification-dot\" style=\"position: relative; top: -6px; width: 8px; height: 8px; background-color: #fd7777; border-radius: 50%; box-shadow: 0 0 4px rgba(255, 64, 64, 0.5);\"></div>\n" +
                            "      </div>\n" +
                            "      <div class=\"bell-container\" style=\"position: relative; padding: 4px;\">\n" +
                            "        <img src=\"https://res.cloudinary.com/dcjkgvmfk/image/upload/v1731037464/logo_ofexva.png\" alt=\"Profile\" class=\"bell-icon\" style=\"width: 80px; height:80px;\">\n" +
                            "      </div>\n" +
                            "    </div>\n" +
                            "\n" +
                            "    <div class=\"content\" style=\"display: flex; gap: 24px; align-items: center; margin: 0px;\">\n" +
                            "      <img src="+ imagePath +" alt=\"Profile\" class=\"profile-image\" style=\"width: 120px; height: 120px; object-fit: cover;\">\n" +
                            "      <div class=\"info\" style=\"flex-grow: 1;\">\n" +
                            "        <h2 class=\"name\" style=\"font-size: 24px; font-weight: bold; margin: 0px; color: #333;\">CẢNH BÁO THIÊN TAI: " + disasterWarningDTO.getDisaster().getDisasterName() + "</h2>\n" +
                            "        <p class=\"time\" style=\"color: #666; font-size: 18px; margin-bottom: 8px;\"><strong>Thời gian: </strong>"+ startDateFormatted +"</p>\n" +
                            "        <p class=\"mutual-friends\" style=\"color: #666; margin-bottom: 16px; line-height: 1.4;\"><strong>Mô tả: </strong> "+ disasterWarningDTO.getDescription() +".<br> Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.</p>\n" +
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
