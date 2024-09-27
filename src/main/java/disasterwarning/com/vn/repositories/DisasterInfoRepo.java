package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisasterInfoRepo extends JpaRepository<DisasterInfo, Integer> {
}

