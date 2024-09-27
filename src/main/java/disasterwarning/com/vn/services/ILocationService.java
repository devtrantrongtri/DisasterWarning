package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.dtos.UserDTO;

public interface ILocationService {

    public LocationDTO findLocationById(int id);
}
