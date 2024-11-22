package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DisasterWarningRepo extends JpaRepository<DisasterWarning, Integer> {

    long countByStatus(String status); // Đếm số bản ghi theo trạng thái

    @Query("SELECT d FROM DisasterWarning d WHERE d.location.locationId = :locationId")
    List<DisasterWarning> findDisasterWarningByLocation(int locationId);

    @Query("SELECT d FROM DisasterWarning d WHERE d.description = :description")
    DisasterWarning findDisasterWarningByDescription(String description);

    @Query("SELECT d FROM DisasterWarning d WHERE d.disaster.disasterName = :disasterName")
    List<DisasterWarning> findDisasterWarningByDisasterName(String disasterName);
}
