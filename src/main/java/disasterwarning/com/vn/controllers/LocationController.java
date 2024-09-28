package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location-management")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping("/location")
    public ResponseEntity<LocationDTO> createLocation(@RequestBody LocationDTO locationDTO) {
        LocationDTO location = locationService.createLocation(locationDTO);
        if (location != null) {
            return ResponseEntity.ok().body(location);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/location/{id}")
    public ResponseEntity<LocationDTO> updateLocation(@PathVariable int id, @RequestBody LocationDTO locationDTO) {
        LocationDTO location = locationService.updateLocation(id, locationDTO);
        if (location != null) {
            return ResponseEntity.ok().body(location);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/location")
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<LocationDTO> locationDTOS = locationService.findAllLocations();
        if (locationDTOS != null) {
            return ResponseEntity.ok().body(locationDTOS);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<LocationDTO> getLocation(@PathVariable int id) {
        LocationDTO locationDTO = locationService.findLocationById(id);
        if (locationDTO != null) {
            return ResponseEntity.ok().body(locationDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/location/{id}")
    public ResponseEntity<Boolean> deleteLocation(@PathVariable int id) {
        boolean deleted = locationService.deleteLocation(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
