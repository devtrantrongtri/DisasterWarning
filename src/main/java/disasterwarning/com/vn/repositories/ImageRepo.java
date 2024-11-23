package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepo extends JpaRepository<Image, Integer> {
}
