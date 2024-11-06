package disasterwarning.com.vn.models.dtos;

import lombok.Data;

@Data
public class TokenDTO {

    private String token;

    private String refreshToken;

    private String tokenType;

    private String userName;

    private String email;

    private String role;

}
