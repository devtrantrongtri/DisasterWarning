package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.services.DisasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/disaster")
public class DisasterController {

    @Autowired
    private DisasterService disasterService;


    @GetMapping
    public ResponseEntity<ResponseWrapper<List<DisasterDTO>>> getAllDisaster() {
        List<DisasterDTO> disasters = disasterService.findAllDisaster();
        ResponseWrapper<List<DisasterDTO>> responseWrapper;

        if (disasters != null && !disasters.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Disaster retrieved successfully", disasters);
            return ResponseEntity.ok(responseWrapper);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseWrapper<DisasterDTO>> getDisaster(@PathVariable int id) {
        DisasterDTO disasters = disasterService.findDisasterById(id);
        ResponseWrapper<DisasterDTO> responseWrapper;

        if (disasters != null) {
            responseWrapper = new ResponseWrapper<>("Disaster retrieved successfully", disasters);
            return ResponseEntity.ok(responseWrapper);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping
    public ResponseEntity<ResponseWrapper<DisasterDTO>> createDisaster
            (@RequestPart("disaster") DisasterDTO disasterDTO,
             @RequestPart(value = "images", required = false) MultipartFile images) {
        try {
            DisasterDTO disaster = disasterService.createDisaster(disasterDTO, images);
            ResponseWrapper<DisasterDTO> responseWrapper;

            if (disaster != null) {
                responseWrapper = new ResponseWrapper<>("Disaster created successfully", disaster);
                return new ResponseEntity<>(responseWrapper, HttpStatus.CREATED);
            } else {
                responseWrapper = new ResponseWrapper<>("Disaster failed to create", null);
                return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            return new ResponseEntity<>(new ResponseWrapper<>(e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ResponseWrapper<DisasterDTO>> updateDisaster
            (@RequestPart("disaster") DisasterDTO disasterDTO,
             @PathVariable int id,
             @RequestPart(value = "images", required = false) MultipartFile images) {
        try {
            DisasterDTO disaster = disasterService.updateDisaster(id, disasterDTO, images);
            ResponseWrapper<DisasterDTO> responseWrapper;

            if (disaster != null) {
                responseWrapper = new ResponseWrapper<>("Disaster updated successfully", disaster);
                return new ResponseEntity<>(responseWrapper, HttpStatus.OK);
            } else {
                responseWrapper = new ResponseWrapper<>("Disaster failed to update", null);
                return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            return new ResponseEntity<>(new ResponseWrapper<>(e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseWrapper<DisasterDTO>> deleteDisaster(@PathVariable int id) {
        try {
            boolean deleted = disasterService.deleteDisaster(id);
            ResponseWrapper<Boolean> responseWrapper =
                    new ResponseWrapper<>("Disaster successfully deleted", deleted);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>(e.getMessage(), null));
        }
    }
}
