package disasterwarning.com.vn.models.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "DISASTER_INFOS")
public class DisasterInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "disasterInfoId")
    private Integer disasterInfoId;

    @ManyToOne
    @JoinColumn(name = "disasterId", nullable = false)
    private Disaster disaster;

    @Column(name = "typeInfo", nullable = false)
    private String typeInfo;

    @Column(name = "information", nullable = false)
    private String information;

    @OneToMany(mappedBy = "disasterInfo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Image> images;
}