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
@Table(name = "IMAGES")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "image_id", nullable = false)
    private int imageId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "image_public_id", nullable = true)
    private String imagePublicId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disaster_info_id", nullable = false)
    private DisasterInfo disasterInfo;
}
