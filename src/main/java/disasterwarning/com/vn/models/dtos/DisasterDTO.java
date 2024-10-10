package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import java.util.List;

@Data
public class DisasterDTO {

    private int disasterId;
    private String disasterName;
    private String imageUrl;
    private String description;

    @JsonManagedReference(value = "disaster-info")
    private List<DisasterInfoDTO> disasterInfos;

    @JsonManagedReference(value = "disaster-warning")
    private List<DisasterWarningDTO> disasterWarnings;
}