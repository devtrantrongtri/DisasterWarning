package disasterwarning.com.vn.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import disasterwarning.com.vn.models.dtos.ImageCloudinaryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileUploadService {

    private final Cloudinary cloudinary;

    public FileUploadService(@Value("${cloudinary.cloud_name}") String cloudName,
                             @Value("${cloudinary.api_key}") String apiKey,
                             @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url"); // Trả về URL của ảnh đã được upload
    }

    public ImageCloudinaryResponse uploadImagev2(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String publicId = (String) uploadResult.get("public_id");
        String secureUrl = (String) uploadResult.get("secure_url");

        // Return an object with both public_id and secure_url
        return new ImageCloudinaryResponse(publicId, secureUrl);
    }

    public String deleteImage(String publicId) {
        try {
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return (String) result.get("result");
        } catch (IOException e) {
            throw new RuntimeException("Error occurred while deleting image: " + e.getMessage(), e);
        }
    }

    public ImageCloudinaryResponse uploadImageWithPublicId(MultipartFile file, String publicId) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Prepare the options for Cloudinary upload
        Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "public_id", publicId,  // Use the existing public_id to overwrite the image
                "overwrite", true       // Overwrite the existing image
        );

        // Upload the new image and overwrite the existing one
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

        String newPublicId = (String) uploadResult.get("public_id");
        String secureUrl = (String) uploadResult.get("secure_url");

        // Return an object with the public_id and secure_url
        return new ImageCloudinaryResponse(newPublicId, secureUrl);
    }

}
