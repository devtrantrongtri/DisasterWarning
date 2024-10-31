package disasterwarning.com.vn.services.sendMail;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.WeatherData;
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

            String content = "<html><body>"
                    + "<h2>Cảnh Báo Thiên Tai: " + disasterWarningDTO.getDisaster().getDisasterName() + "</h2>"
                    + "<p><strong>Vị trí:</strong> " + disasterWarningDTO.getLocation().getLocationName() + "</p>"
                    + "<p><strong>Thời gian bắt đầu:</strong> " + startDateFormatted + "</p>"
                    + "<p><strong>Mô tả:</strong> " + disasterWarningDTO.getDescription() + "</p>"
                    + "<p>Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.</p>"
                    + "</body></html>";

            helper.setText(content, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
