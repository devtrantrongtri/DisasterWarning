package disasterwarning.com.vn.services.sendMail;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;

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

            String content = "<html><body style=\"font-family: 'Arial', sans-serif; background-color: #f3f4f6; padding: 20px;\">"
                    + "<div style=\"max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 25px; border-radius: 10px; border-left: 8px solid #d9534f; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);\">"
                    + "<h2 style=\"color: #d9534f; font-size: 26px; margin-bottom: 15px; display: flex; align-items: center;\">"
                    + "Cảnh Báo Thiên Tai: " + disasterWarningDTO.getDisaster().getDisasterName() + "</h2>"
                    + "<p style=\"font-size: 16px; margin-bottom: 10px;\"><strong style=\"color: #333333;\">Vị trí:</strong> <span style=\"color: #555555;\">" + disasterWarningDTO.getLocation().getLocationName() + "</span></p>"
                    + "<p style=\"font-size: 16px; margin-bottom: 10px;\"><strong style=\"color: #333333;\">Thời gian:</strong> <span style=\"color: #555555;\">" + startDateFormatted + "</span></p>"
                    + "<p style=\"font-size: 16px; margin-bottom: 15px;\"><strong style=\"color: #333333;\">Mô tả:</strong> <span style=\"color: #555555;\">" + disasterWarningDTO.getDescription() + "</span></p>"
                    + "<p style=\"color: #333333; font-size: 15px; line-height: 1.6;\">Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.</p>"
                    + "</div>"
                    + "</body></html>";


            helper.setText(content, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
