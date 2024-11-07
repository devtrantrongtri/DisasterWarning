package disasterwarning.com.vn.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard-management")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {
}
