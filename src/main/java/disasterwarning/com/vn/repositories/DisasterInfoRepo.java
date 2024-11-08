package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterInfoRepo extends JpaRepository<DisasterInfo, Integer> {

    @Query("SELECT d.disasterInfos FROM Disaster d")
    public List<DisasterInfo> getDisasterInfos();
}

