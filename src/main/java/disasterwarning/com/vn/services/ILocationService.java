package disasterwarning.com.vn.services;

import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.LocationDTO;

import java.util.List;

public interface ILocationService {

    public LocationDTO findLocationById(int id) throws DataNotFoundException;

    public LocationDTO findLocationByName(String name) throws DataNotFoundException;

    public List<LocationDTO> findAllLocations() throws DataNotFoundException;

    public LocationDTO createLocation(LocationDTO locationDTO) throws DuplicateDataException;

    public LocationDTO updateLocation(int id, LocationDTO locationDTO) throws DataNotFoundException;

    public boolean deleteLocation(int id) throws DataNotFoundException;
}
