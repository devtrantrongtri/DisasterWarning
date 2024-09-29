package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.models.dtos.ImageCloudinaryResponse;
import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.DisasterInfo;
import disasterwarning.com.vn.models.entities.Image;
import disasterwarning.com.vn.repositories.DisasterInfoRepo;
import disasterwarning.com.vn.repositories.DisasterRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DisasterInfoService implements IDisasterInfoService {
    private final DisasterInfoRepo disasterInfoRepo;
    private final FileUploadService fileUploadService;
    private final DisasterRepo disasterRepo;
    private final Mapper mapper;

    public DisasterInfoService(DisasterInfoRepo disasterInfoRepo, Mapper mapper,FileUploadService fileUploadService,DisasterRepo disasterRepo) {
        this.disasterInfoRepo = disasterInfoRepo;
        this.fileUploadService = fileUploadService;
        this.disasterRepo = disasterRepo;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public DisasterInfoDTO createDisasterInfo(DisasterInfoDTO disasterInfoDTO, List<MultipartFile> images) {

        // check Disaster khi tạo DisasterInfo
        int disasterId = disasterInfoDTO.getDisaster().getDisasterId();

        Disaster disaster = disasterRepo.findById(disasterId)
                .orElseThrow(() -> new RuntimeException("Disaster không tồn tại với ID: " + disasterId));

        // Convert DTO to Entity
        DisasterInfo disasterInfo = mapper.convertToEntity(disasterInfoDTO, DisasterInfo.class);


        // Save disasterInfo
        DisasterInfo savedDisasterInfo = disasterInfoRepo.save(disasterInfo);

        // upload ảnh và lưu vào cơ sở dữ liệu
        if (images != null && !images.isEmpty()) {
            List<Image> imageEntities = new ArrayList<>();

            for (MultipartFile imageFile : images) {
                try {
                    // Upload từng file ảnh lên Cloudinary và lấy URL
                    ImageCloudinaryResponse mageCloudinaryResponse = fileUploadService.uploadImagev2(imageFile);

                    //Image và  disasterInfo
                    Image imageEntity = new Image();
                    imageEntity.setImageUrl(mageCloudinaryResponse.getSecureUrl());
                    imageEntity.setImagePublicId(mageCloudinaryResponse.getPublicId());
                    imageEntity.setDisasterInfo(savedDisasterInfo);  //  Linking Image và DisasterInfo

                    // add image to images
                    imageEntities.add(imageEntity);
                } catch (IOException e) {
                    throw new RuntimeException("Lỗi khi upload ảnh: " + imageFile.getOriginalFilename(), e);
                }
            }

            // Liên kết các ảnh vào disasterInfo và lưu lại vào cơ sở dữ liệu
            savedDisasterInfo.setImages(imageEntities);
            disasterInfoRepo.save(savedDisasterInfo);
        }

        // Convert back to DTO and return
        return mapper.convertToDto(savedDisasterInfo, DisasterInfoDTO.class);
    }

    @Override
    public DisasterInfoDTO findDisasterInfoById(int id) {
        DisasterInfo disasterInfo = disasterInfoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Info does not exist"));
        return mapper.convertToDto(disasterInfo, DisasterInfoDTO.class);
    }

    @Override
    public List<DisasterInfoDTO> findAllDisasterInfos() {
        List<DisasterInfo> disasterInfos = disasterInfoRepo.findAll();
        return mapper.convertToDtoList(disasterInfos, DisasterInfoDTO.class);
    }

    @Override
    public DisasterInfoDTO updateDisasterInfo(int id, DisasterInfoDTO disasterInfoDTO) {
        Optional<DisasterInfo> disasterInfoOpt = disasterInfoRepo.findById(id);
        if (disasterInfoOpt.isEmpty()) {
            throw new RuntimeException("DisasterInfo with ID " + id + " does not exist");
        }
        DisasterInfo existingDisasterInfo = disasterInfoOpt.get();
        DisasterInfo updatedDisasterInfo = mapper.convertToEntity(disasterInfoDTO, DisasterInfo.class);
        updatedDisasterInfo.setDisasterInfoId(existingDisasterInfo.getDisasterInfoId());
        updatedDisasterInfo.setDisaster(existingDisasterInfo.getDisaster());
        updatedDisasterInfo.setImages(existingDisasterInfo.getImages());
        DisasterInfo savedDisasterInfo = disasterInfoRepo.save(updatedDisasterInfo);
        return mapper.convertToDto(savedDisasterInfo, DisasterInfoDTO.class);
    }

    @Override
    public boolean deleteDisasterInfo(int id) {

        Optional<DisasterInfo> disasterInfoOptional = disasterInfoRepo.findById(id);
        if (disasterInfoOptional.isPresent()) {
            DisasterInfo disasterInfo = disasterInfoOptional.get();
            List<Image> images = disasterInfo.getImages();
            for (Image image : images) {
                try {
                    // Delete image from Cloudinary by publicId
                    String result = fileUploadService.deleteImage(image.getImagePublicId());
                    if (!"ok".equals(result)) {
                        throw new RuntimeException("Failed to delete image from Cloudinary: " + image.getImagePublicId());
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error occurred while deleting image with publicId " + image.getImagePublicId(), e);
                }
            }

            disasterInfoRepo.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("DisasterInfo not found with id " + id);
        }
    }

}
