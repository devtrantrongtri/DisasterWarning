package disasterwarning.com.vn.models.dtos;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.Image;
import lombok.Data;

import java.util.List;
@Data
public class DisasterInfoDTO {
    private String typeInfo;
    private String information;

    @JsonManagedReference
    private DisasterDTO disaster;
    @JsonManagedReference
    private List<ImageDTO> images;
}
