package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import java.sql.Date;

@Data
public class DisasterWarningDTO {

    private int disasterWarningId;
    private Date startDate;
    private Date endDate;
    private String description;

    @JsonBackReference(value = "disaster-warning")
    private DisasterDTO disaster;

    @JsonBackReference(value = "location-warning")
    private LocationDTO location;
}
