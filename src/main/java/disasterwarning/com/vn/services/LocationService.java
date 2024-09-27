package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.repositories.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationService implements ILocationService {

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private Mapper mapper;

    @Override
    public LocationDTO findLocationById(int id){
        Location location = locationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Location Not found"));

        return mapper.convertToEntity(location, LocationDTO.class);
    }

}
