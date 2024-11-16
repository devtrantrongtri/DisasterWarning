package disasterwarning.com.vn.services;

import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ILocationService {

    public LocationDTO findLocationById(int id) throws DataNotFoundException;

    public LocationDTO findByLatAndLon(BigDecimal lat, BigDecimal lon) throws DataNotFoundException;

    public LocationDTO findLocationByName(String name) throws DataNotFoundException;

    public Page<LocationDTO> findAllLocations(Pageable pageable) throws DataNotFoundException;

    public LocationDTO createLocation(LocationDTO locationDTO) throws DuplicateDataException;

    public LocationDTO updateLocation(int id, LocationDTO locationDTO) throws DataNotFoundException;

    public boolean deleteLocation(int id) throws DataNotFoundException;
}
