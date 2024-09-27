package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import disasterwarning.com.vn.models.entities.DisasterInfo;
import jakarta.persistence.*;

public class ImageDTO {

    private int imageId;
    private String imageUrl;

    @JsonBackReference
    private DisasterInfoDTO disasterInfo;
}
