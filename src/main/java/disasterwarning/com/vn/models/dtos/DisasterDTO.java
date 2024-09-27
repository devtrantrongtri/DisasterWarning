package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

public class DisasterDTO {

    private int disasterId;
    private String disasterName;
    private String imageUrl;
    private String description;

    @JsonBackReference
    private List<DisasterInfoDTO> disasterInfos;

    @JsonBackReference
    private List<DisasterWarningDTO> disasterWarnings;
}
