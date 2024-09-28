package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class LocationDTO {

    private int locationId;
    @JsonProperty("locationName")
    private String locationName;
    @JsonProperty("latitude")
    private BigDecimal latitude;
    @JsonProperty("longitude")
    private BigDecimal longitude;
    private String status;

    @JsonBackReference(value = "location-user")
    private UserDTO user;

    @JsonManagedReference(value = "location-warning")
    private List<DisasterWarningDTO> disasterWarnings;
}
