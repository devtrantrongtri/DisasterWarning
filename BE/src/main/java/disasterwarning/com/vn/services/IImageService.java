package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.ImageDTO;
import disasterwarning.com.vn.models.entities.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IImageService {
    ImageDTO createImage(ImageDTO imageDTO, MultipartFile file);
    List<ImageDTO> getAllImages() ;
    Optional<ImageDTO> getImageById(int id) ;
    ImageDTO updateImage(int id, ImageDTO imageDetails, MultipartFile newFile) ;
    boolean deleteImage(int id) ;
}
