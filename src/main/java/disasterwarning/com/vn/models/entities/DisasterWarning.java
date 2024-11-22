package disasterwarning.com.vn.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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

    @Column(name = "status", nullable = false)
    private String status; // Trạng thái: active, inactive, etc.

    // Constructor không có trường `disasterWarningId` (thường dùng cho khởi tạo entity mới)
    public DisasterWarning(Disaster disaster, Location location, Date startDate, String description, String status) {
        this.disaster = disaster;
        this.location = location;
        this.startDate = startDate;
        this.description = description;
        this.status = status;
    }
}
