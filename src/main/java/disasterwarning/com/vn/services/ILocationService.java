package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.LocationDTO;

import java.util.List;

public interface ILocationService {

    public LocationDTO findLocationById(int id);

    public LocationDTO findLocationByName(String name);

    public List<LocationDTO> findAllLocations();

    public LocationDTO createLocation(LocationDTO locationDTO);

    public LocationDTO updateLocation(int id, LocationDTO locationDTO);

    public boolean deleteLocation(int id);
}
