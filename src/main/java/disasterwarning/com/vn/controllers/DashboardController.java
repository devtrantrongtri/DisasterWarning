package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.services.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard-management")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    // Constructor injection để lấy DashboardService
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/user-count")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Integer> getUserCount() {
        try {
            int userCount = dashboardService.getUserCount();
            return ResponseEntity.ok(userCount);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build(); // Trả lỗi nếu xảy ra vấn đề
        }
    }

    @GetMapping("/alert-count")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Đảm bảo chỉ admin truy cập được
    public ResponseEntity<Integer> getAlertCount() {
        try {
            int alertCount = dashboardService.getAlertCount();
            return ResponseEntity.ok(alertCount);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build(); // Trả lỗi nếu xảy ra vấn đề
        }
    }
}
