package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.services.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public int getUserCount() {
        // Gọi service để lấy dữ liệu người dùng
        return dashboardService.getUserCount();
    }

    @GetMapping("/alert-count")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public int getAlertCount() {
        // Gọi service để lấy dữ liệu cảnh báo
        return dashboardService.getAlertCount();
    }
}
