package disasterwarning.com.vn.components;

import disasterwarning.com.vn.services.DisasterWarningService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

//@Component
public class DisasterWarningStartup {
    private final DisasterWarningService disasterWarningService;

    public DisasterWarningStartup(DisasterWarningService disasterWarningService) {
        this.disasterWarningService = disasterWarningService;
    }

    @EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void sendWarningsOnStartup() {
        System.out.println("Server started. Sending disaster warnings...");
        disasterWarningService.sendDisasterWarning();
    }
}
