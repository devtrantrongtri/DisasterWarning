package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.Image;
import lombok.Data;

import java.util.List;

@Data
public class DisasterInfoDTO {
    private Integer disasterInfoId;
    private String typeInfo;
    private String information;

    @JsonBackReference(value = "disaster-info")
    private DisasterDTO disaster;
    @JsonManagedReference(value = "disaster-img")
    private List<ImageDTO> images;
}
