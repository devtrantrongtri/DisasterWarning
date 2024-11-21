package disasterwarning.com.vn.components;

import disasterwarning.com.vn.services.DisasterWarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledWarningTask {

    @Autowired
    private DisasterWarningService disasterWarningService;

    @Scheduled(fixedRate = 3600000) // 1 hour
    public void scheduleSendWarning() {
        disasterWarningService.sendDisasterWarning();
    }
}
