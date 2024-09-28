package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepo extends JpaRepository<Location, Integer> {

    @Query("select l from Location l where l.locationName=:name")
    Location findByName(@Param("name") String name);
}
