package disasterwarning.com.vn.models.dtos;

import lombok.Data;

@Data
public class ImageCloudinaryResponse {
    private String publicId;
    private String secureUrl;

    // Constructor
    public ImageCloudinaryResponse(String publicId, String secureUrl) {
        this.publicId = publicId;
        this.secureUrl = secureUrl;
    }
}