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
@Table(name = "DISASTERS")
public class Disaster {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "disasterId")
    private Integer disasterId;

    @Column(name = "disasterName", nullable = false)
    private String disasterName;

    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "disaster", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DisasterInfo> disasterInfos;

    @OneToMany(mappedBy = "disaster", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DisasterWarning> disasterWarnings;

}