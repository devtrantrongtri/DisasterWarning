package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.models.entities.DisasterInfo;
import disasterwarning.com.vn.models.entities.Image;
import disasterwarning.com.vn.repositories.DisasterInfoRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisasterInfoService implements IDisasterInfoService {
    private final DisasterInfoRepo disasterInfoRepo;
    private final Mapper mapper;

    public DisasterInfoService(DisasterInfoRepo disasterInfoRepo, Mapper mapper) {
        this.disasterInfoRepo = disasterInfoRepo;
        this.mapper = mapper;
    }

    @Override
    public DisasterInfoDTO createDisasterInfo(DisasterInfoDTO disasterInfoDTO) {
        // Convert DTO to Entity
        DisasterInfo disasterInfo = mapper.convertToEntity(disasterInfoDTO, DisasterInfo.class);

        // Set Disaster tu repository

        // Save disasterInfo
        DisasterInfo savedDisasterInfo = disasterInfoRepo.save(disasterInfo);
        //TODO:  Save images linked to disasterInfo

        // Convert back to DTO
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
        // Fetch existing disasterInfỏ from repository
        Optional<DisasterInfo> disasterInfoOpt = disasterInfoRepo.findById(id);

        // Check if the disaster info exists, otherwise throw an error
        if (disasterInfoOpt.isEmpty()) {
            throw new RuntimeException("DisasterInfo with ID " + id + " does not exist");
        }

        // Get the existing entity
        DisasterInfo existingDisasterInfo = disasterInfoOpt.get();

        // Map fields from DTO to the existing entity
        DisasterInfo updatedDisasterInfo = mapper.convertToEntity(disasterInfoDTO, DisasterInfo.class);

        // Ensure the ID remains the same, as we're updating an existing record
        updatedDisasterInfo.setDisasterInfoId(existingDisasterInfo.getDisasterInfoId());


        updatedDisasterInfo.setDisaster(existingDisasterInfo.getDisaster());  // Keep the associated disaster
        // TODO: save image

        // Save the updated disaster info
        DisasterInfo savedDisasterInfo = disasterInfoRepo.save(updatedDisasterInfo);

        // Convert the updated entity back to DTO and return it
        return mapper.convertToDto(savedDisasterInfo, DisasterInfoDTO.class);
    }

    @Override
    public boolean deleteDisasterInfo(int id) {
        // Check if the disaster info exists
        if (disasterInfoRepo.existsById(id)) {
            disasterInfoRepo.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("DisasterInfo not found with id " + id);
        }
    }

}
