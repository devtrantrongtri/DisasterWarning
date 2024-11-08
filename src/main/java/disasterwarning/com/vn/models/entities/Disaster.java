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
    @Column(name = "disaster_id")
    private int disasterId;

    @Column(name = "disaster_name", nullable = false, unique = true)
    private String disasterName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "disaster", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DisasterInfo> disasterInfos;

    @OneToMany(mappedBy = "disaster", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DisasterWarning> disasterWarnings;

    public Disaster(String disasterName, String imageUrl, String description) {
        this.disasterName = disasterName;
        this.imageUrl = imageUrl;
        this.description = description;
    }

}