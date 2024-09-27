package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepo extends JpaRepository<Location, Integer> {
}
