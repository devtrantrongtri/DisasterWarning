package disasterwarning.com.vn.services.sendMail;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.WeatherData;

public interface IMailService {
    public void sendMail(String to, DisasterWarningDTO disasterWarningDTO);
}
