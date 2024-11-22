package disasterwarning.com.vn.services;

import disasterwarning.com.vn.repositories.AlertRepo;
import disasterwarning.com.vn.repositories.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepo userRepo;
    private final AlertRepo alertRepo;

    // Constructor injection
    public DashboardService(UserRepo userRepo, AlertRepo alertRepo) {
        this.userRepo = userRepo;
        this.alertRepo = alertRepo;
    }

    // Lấy số lượng người dùng
    public int getUserCount() {
        // Sử dụng UserRepo để đếm số lượng người dùng với vai trò cụ thể, ví dụ: ROLE_USER
        long userCount = userRepo.countByRole("ROLE_USER");
        return (int) userCount;
    }

    // Lấy số lượng cảnh báo
    public int getAlertCount() {
        // Sử dụng AlertRepo để đếm số lượng cảnh báo
        long alertCount = alertRepo.countByStatus("Active"); // Ví dụ lấy số lượng cảnh báo "Active"
        return (int) alertCount;
    }
}
