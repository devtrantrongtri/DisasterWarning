package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterInfoRepo extends JpaRepository<DisasterInfo, Integer> {

    @Query("SELECT d FROM DisasterInfo d WHERE d.disaster.disasterId=:id")
    public List<DisasterInfo> getDisasterInfos(@Param("id") int id);
}

