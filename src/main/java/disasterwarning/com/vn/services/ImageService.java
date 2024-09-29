package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.models.dtos.ImageCloudinaryResponse;
import disasterwarning.com.vn.models.dtos.ImageDTO;
import disasterwarning.com.vn.models.entities.DisasterInfo;
import disasterwarning.com.vn.models.entities.Image;
import disasterwarning.com.vn.repositories.ImageRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@Service
@Slf4j
public class ImageService implements IImageService {

    private final ImageRepo imageRepository;
    private final Mapper mapper;
    private final FileUploadService fileUploadService;

    @Autowired
    public ImageService(ImageRepo imageRepository, Mapper mapper, FileUploadService fileUploadService) {
        this.imageRepository = imageRepository;
        this.mapper = mapper;
        this.fileUploadService = fileUploadService;
    }

    // Create and upload a new image
    @Override
    public ImageDTO createImage(ImageDTO imageDTO, MultipartFile file) {
        try {
            // Upload image to Cloudinary
            ImageCloudinaryResponse uploadResponse = fileUploadService.uploadImagev2(file);

            // Create Image entity
            Image image = mapper.convertToEntity(imageDTO, Image.class);
            image.setImagePublicId(uploadResponse.getPublicId());
            image.setImageUrl(uploadResponse.getSecureUrl());

            // Save image to database
            Image savedImage = imageRepository.save(image);

            // Return DTO of saved image
            return mapper.convertToDto(savedImage, ImageDTO.class);
        } catch (IOException e) {
            log.error("Error uploading image", e);
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    // Retrieve all images
    @Override
    public List<ImageDTO> getAllImages() {
        List<Image> images = imageRepository.findAll();
        return mapper.convertToDtoList(images, ImageDTO.class);
    }

    // Retrieve image by ID
    @Override
    public Optional<ImageDTO> getImageById(int id) {
        Optional<Image> image = imageRepository.findById(id);
        return image.map(img -> mapper.convertToDto(img, ImageDTO.class));
    }

    // Update an image (both metadata and actual image file)
    @Override
    public ImageDTO updateImage(int id, ImageDTO imageDetails, MultipartFile newFile) {
        Optional<Image> existingImageOpt = imageRepository.findById(id);

        if (existingImageOpt.isEmpty()) {
            throw new RuntimeException("Image with ID " + id + " does not exist");
        }

        Image existingImage = existingImageOpt.get();

        try {
            // Overwrite the image on Cloudinary
            ImageCloudinaryResponse updatedImageResponse = fileUploadService.uploadImageWithPublicId(newFile, existingImage.getImagePublicId());

            // Update Image entity with new URL
            existingImage.setImageUrl(updatedImageResponse.getSecureUrl());
            existingImage.setDisasterInfo(mapper.convertToEntity(imageDetails.getDisasterInfo(), DisasterInfo.class));

            // Save updated image to database
            Image savedImage = imageRepository.save(existingImage);

            // Return DTO of updated image
            return mapper.convertToDto(savedImage, ImageDTO.class);
        } catch (IOException e) {
            log.error("Error updating image", e);
            throw new RuntimeException("Failed to update image", e);
        }
    }

    // Delete an image by ID
    @Override
    public boolean deleteImage(int id) {
        Optional<Image> imageOpt = imageRepository.findById(id);

        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            try {
                // Delete the image from Cloudinary
                String result = fileUploadService.deleteImage(image.getImagePublicId());
                if (!"ok".equals(result)) {
                    throw new RuntimeException("Failed to delete image from Cloudinary: " + image.getImagePublicId());
                }

                // Remove image record from the database
                imageRepository.deleteById(id);
                return true;
            } catch (Exception e) {
                log.error("Error deleting image", e);
                throw new RuntimeException("Failed to delete image", e);
            }
        } else {
            throw new RuntimeException("Image with ID " + id + " does not exist");
        }
    }
}

