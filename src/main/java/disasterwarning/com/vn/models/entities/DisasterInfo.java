package disasterwarning.com.vn.models.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "disaster_info")
public class DisasterInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "disaster_type_id", nullable = false)
    private DisasterType disasterType;

    @Column(nullable = true)
    private String formationProcess;

    @Column(nullable = true)
    private String destructivePower;

    @Column(nullable = true)
    private String preventionMethods;
}