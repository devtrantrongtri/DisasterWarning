package disasterwarning.com.vn.services;

import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.repositories.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class LocationService implements ILocationService {

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private Mapper mapper;

    @Override
    public LocationDTO findLocationById(int id){
        Location location = locationRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Location Not found"));
        return mapper.convertToEntity(location, LocationDTO.class);
    }

    @Override
    public LocationDTO findLocationByName(String name) {
        Location location = locationRepo.findByName(name);
        if(location == null || Objects.equals(location.getStatus(), "inactive")) {
            throw new DataNotFoundException("Location Not found");
        }
        return mapper.convertToDto(location, LocationDTO.class);
    }

    @Override
    public LocationDTO findByLatAndLon(BigDecimal lat, BigDecimal lon) {
        Location location = locationRepo.findByLatAndLon(lat,lon);
        if(location == null || Objects.equals(location.getStatus(), "inactive")) {
            throw new DataNotFoundException("Location Not found");
        }
        return mapper.convertToDto(location, LocationDTO.class);
    }

    @Override
    public Page<LocationDTO> findAllLocations(Pageable pageable) {
        Page<Location> locations = locationRepo.findAllLocationActive(pageable);
        if (locations.isEmpty()) {
            throw new DataNotFoundException("Location Not found");
        }
        return mapper.convertToDtoPage(locations, LocationDTO.class);
    }

    @Override
    public LocationDTO createLocation(LocationDTO locationDTO) throws DuplicateDataException {

        Location locationToSave = mapper.convertToEntity(locationDTO, Location.class);

        if (locationRepo.findById(locationToSave.getLocationId()).isPresent()) {
            throw new DuplicateDataException("Location already exists");
        }
        locationToSave.setStatus("active");
        Location savedLocation = locationRepo.save(locationToSave);

        return mapper.convertToDto(savedLocation, LocationDTO.class);
    }



    @Override
    public LocationDTO updateLocation(int id, LocationDTO locationDTO) {
        Location newLocation = mapper.convertToEntity(locationDTO, Location.class);
        Location existingLocation = locationRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Location Not found"));
        existingLocation.setLocationName(newLocation.getLocationName());
        existingLocation.setLatitude(newLocation.getLatitude());
        existingLocation.setLongitude(newLocation.getLongitude());
        locationRepo.save(existingLocation);
        return mapper.convertToDto(existingLocation, LocationDTO.class);
    }

    @Override
    public boolean deleteLocation(int id) {
        Location existingLocation = locationRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Location Not found"));
        existingLocation.setStatus("inactive");
        locationRepo.save(existingLocation);
        return true;
    }

    @Override
    public List<LocationDTO> findLocationHaveWarning() throws DataNotFoundException {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysFromNow = today.plusDays(7);
        List<Location> locations = locationRepo.findAllLocationWithWarning(today, sevenDaysFromNow);
        return mapper.convertToDtoList(locations, LocationDTO.class);
    }

}
