package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.DisasterWarning;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisasterWarningRepo extends JpaRepository<DisasterWarning, Integer> {
}
