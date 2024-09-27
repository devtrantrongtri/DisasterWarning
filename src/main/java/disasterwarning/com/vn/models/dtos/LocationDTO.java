package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.models.entities.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

public class LocationDTO {

    private int locationId;
    private String locationName;
    private BigDecimal latitude;
    private BigDecimal longitude;

    @JsonBackReference
    private UserDTO user;

    @JsonBackReference
    private List<DisasterWarningDTO> disasterWarnings;
}
