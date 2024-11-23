package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface LocationRepo extends JpaRepository<Location, Integer> {

    @Query("select l from Location l where l.locationName=:name")
    Location findByName(@Param("name") String name);

    @Query("select l from Location l where l.latitude = :lat and l.longitude = :lon")
    Location findByLatAndLon(@Param("lat") BigDecimal lat, @Param("lon") BigDecimal lon);

    @Query("select l from Location l where l.status = 'active'")
    Page<Location> findAllLocationActive(Pageable pageable);

    @Query("select l from Location l join l.disasterWarnings dw where dw.startDate between :startDate and :endDate group by l")
    List<Location> findAllLocationWithWarning(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
