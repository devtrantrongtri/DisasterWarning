package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.repositories.DisasterWarningRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisasterWarningService implements IDisasterWarningService {

    @Autowired
    private DisasterWarningRepo disasterWarningRepo;

    @Autowired
    private DisasterService disasterService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private Mapper mapper;

    @Override
    public DisasterWarningDTO createDisasterWarning(DisasterWarningDTO disasterWarningDTO){
        DisasterWarning newDisasterWarning = mapper.convertToEntity(disasterWarningDTO, DisasterWarning.class);

        if(newDisasterWarning.getDisaster() == null){
            throw new RuntimeException("Disaster is null");
        }
        else {
            DisasterDTO existingDisaster = disasterService.findDisasterById(newDisasterWarning.getDisaster().getDisasterId());
            if(existingDisaster == null){
                throw new RuntimeException("Disaster not found");
            }
        }

        if(newDisasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            LocationDTO existingLocation = locationService.findLocationById(newDisasterWarning.getLocation().getLocationId());
            if(existingLocation == null){
                throw new RuntimeException("Location not found");
            }
        }

        disasterWarningRepo.save(newDisasterWarning);
        return mapper.convertToEntity(newDisasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public DisasterWarningDTO updateDisasterWarning(int id,DisasterWarningDTO disasterWarningDTO){
        DisasterWarning disasterWarning = mapper.convertToEntity(disasterWarningDTO, DisasterWarning.class);

        DisasterWarning updateDisasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        if(disasterWarning.getDisaster() == null){
            throw new RuntimeException("Disaster is null");
        }
        else {
            DisasterDTO existingDisaster = disasterService.findDisasterById(disasterWarning.getDisaster().getDisasterId());
            if(existingDisaster == null){
                throw new RuntimeException("Disaster not found");
            }
            updateDisasterWarning.setDisaster(disasterWarning.getDisaster());

        }

        if(disasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            LocationDTO existingLocation = locationService.findLocationById(disasterWarning.getLocation().getLocationId());
            if(existingLocation == null){
                throw new RuntimeException("Location not found");
            }
            updateDisasterWarning.setLocation(disasterWarning.getLocation());
        }

        updateDisasterWarning.setStartDate(disasterWarning.getStartDate());
        updateDisasterWarning.setEndDate(disasterWarning.getEndDate());
        updateDisasterWarning.setDescription(disasterWarning.getDescription());

        disasterWarningRepo.save(disasterWarning);
        return mapper.convertToEntity(disasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public DisasterWarningDTO findDisasterWarningById(int id){
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        return mapper.convertToEntity(disasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public List<DisasterWarningDTO> findAllDisasterWarning(){
        List<DisasterWarning> disasterWarnings = disasterWarningRepo.findAll();
        if(disasterWarnings == null){
            throw new RuntimeException("List Disaster Warning not found");
        }
        return mapper.convertToEntityList(disasterWarnings, DisasterWarningDTO.class);
    }

    public boolean deleteDisasterWarning(int id){
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        disasterWarningRepo.delete(disasterWarning);
        return true;
    }
}
