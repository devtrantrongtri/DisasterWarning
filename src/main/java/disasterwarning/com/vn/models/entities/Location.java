package disasterwarning.com.vn.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "LOCATIONS")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "location_id", nullable = false)
    private int locationId;

    @Column(name = "location_name", nullable = false, unique = true)
    private String locationName;

    @Column(name = "latitude", nullable = false)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false)
    private BigDecimal longitude;

    @Column(name = "status", nullable = false )
    private String status;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    private List<User> user;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DisasterWarning> disasterWarnings;

    public Location(String locationName, BigDecimal latitude, BigDecimal longitude) {
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
