package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.sql.Date;

public class DisasterWarningDTO {

    private int disasterWarningId;
    private Date startDate;
    private Date endDate;
    private String description;

    @JsonManagedReference
    private DisasterDTO disaster;

    @JsonManagedReference
    private LocationDTO location;
}
