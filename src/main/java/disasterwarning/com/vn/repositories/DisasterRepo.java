package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.DisasterInfo;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DisasterRepo extends JpaRepository<Disaster, Integer> {

    @Query("SELECT d.disasterWarnings FROM Disaster d")
    public List<DisasterWarning> getDisasterWarnings();

    @Query("SELECT d.disasterInfos FROM Disaster d")
    public List<DisasterInfo> getDisasterInfos();
}
