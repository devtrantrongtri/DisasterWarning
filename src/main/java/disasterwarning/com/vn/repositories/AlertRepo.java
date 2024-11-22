package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepo extends JpaRepository<DisasterWarning, Integer> {

    // Lấy tất cả cảnh báo cho một loại thảm họa theo tên
    List<DisasterWarning> findByDisaster_DisasterName(String disasterName);

    // Lấy số lượng cảnh báo theo trạng thái (ví dụ: "Active", "Resolved")
    long countByStatus(String status);

    // Lấy cảnh báo theo thời gian bắt đầu (có thể dùng ví dụ theo ngày)
    List<DisasterWarning> findByStartDateBetween(java.sql.Date startDate, java.sql.Date endDate);
}
