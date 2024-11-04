package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    private int userId;
    private String userName;
    private String email;
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự.")
    private String password;
    private String role;
    private String status;

    @JsonManagedReference(value = "location-user")
    private LocationDTO location;
}
