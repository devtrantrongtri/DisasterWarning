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
    @Column(name = "disasterWarningId", nullable = false)
    private int disasterWarningId;

    @ManyToOne
    @JoinColumn(name = "disasterId", nullable = false)
    private Disaster disaster;

    @ManyToOne
    @JoinColumn(name = "locationId", nullable = false)
    private Location location;

    @Column(name = "startDate", nullable = false)
    private Date startDate;

    @Column(name = "endDate", nullable = false)
    private Date endDate;

    @Column(name = "description", nullable = false)
    private String description;
}
