package disasterwarning.com.vn.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "DISASTER_WARNINGS")
public class DisasterWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "disaster_warning_id", nullable = false)
    private int disasterWarningId;

    @ManyToOne
    @JoinColumn(name = "disaster_id", nullable = false)
    private Disaster disaster;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
}
