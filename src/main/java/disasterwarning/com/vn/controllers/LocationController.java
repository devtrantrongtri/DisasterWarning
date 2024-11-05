package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location-management")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping("/location")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<LocationDTO>> createLocation(@RequestBody LocationDTO locationDTO) {
        try {
            LocationDTO createdLocation = locationService.createLocation(locationDTO);
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location created successfully", createdLocation);
            return new ResponseEntity<>(responseWrapper, HttpStatus.CREATED);
        } catch (DuplicateDataException e) {
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location already exists", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/location/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<LocationDTO>> updateLocation(@PathVariable int id, @RequestBody LocationDTO locationDTO) {
        try {
            LocationDTO updatedLocation = locationService.updateLocation(id, locationDTO);
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location updated successfully", updatedLocation);
            return ResponseEntity.ok(responseWrapper);
        } catch (DataNotFoundException e) {
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/location")
    public ResponseEntity<ResponseWrapper<List<LocationDTO>>> getAllLocations() {
        List<LocationDTO> locationDTOS = locationService.findAllLocations();
        ResponseWrapper<List<LocationDTO>> responseWrapper;

        if (locationDTOS != null && !locationDTOS.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Locations retrieved successfully", locationDTOS);
            return ResponseEntity.ok(responseWrapper);
        } else {
            responseWrapper = new ResponseWrapper<>("No locations found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<ResponseWrapper<LocationDTO>> getLocation(@PathVariable int id) {
        try {
            LocationDTO locationDTO = locationService.findLocationById(id);
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location retrieved successfully", locationDTO);
            return ResponseEntity.ok(responseWrapper);
        } catch (DataNotFoundException e) {
            ResponseWrapper<LocationDTO> responseWrapper = new ResponseWrapper<>("Location not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/location/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Boolean>> deleteLocation(@PathVariable int id) {
        try {
            boolean deleted = locationService.deleteLocation(id);
            ResponseWrapper<Boolean> responseWrapper = new ResponseWrapper<>("Location deleted successfully", deleted);
            return ResponseEntity.noContent().build();
        } catch (DataNotFoundException e) {
            ResponseWrapper<Boolean> responseWrapper = new ResponseWrapper<>("Location not found", false);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

}
