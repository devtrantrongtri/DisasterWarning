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
        // Kiểm tra role hợp lệ trong database
        long userCount = userRepo.countByRole("user");
        return Math.toIntExact(userCount); // Sử dụng Math.toIntExact để tránh lỗi số lớn
    }

    // Lấy số lượng cảnh báo
    public int getAlertCount() {
        // Đếm số lượng cảnh báo với trạng thái "Active"
        long alertCount = alertRepo.countByStatus("active");
        return Math.toIntExact(alertCount); // Đảm bảo tương thích với kiểu int
    }
}
