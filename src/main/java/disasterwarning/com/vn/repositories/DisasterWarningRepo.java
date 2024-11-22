package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DisasterWarningRepo extends JpaRepository<DisasterWarning, Integer> {

    long countByStatus(String status);

    @Query("SELECT d FROM DisasterWarning d WHERE d.location.locationId=:locationId")
    public List<DisasterWarning> findDisasterWarningByLocation(String locationId);
}

