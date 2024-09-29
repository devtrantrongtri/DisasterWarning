package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.models.entities.Image;
import disasterwarning.com.vn.services.FileUploadService;
import disasterwarning.com.vn.services.IDisasterInfoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/disaster-info")
public class DisasterInfoController {
    private final IDisasterInfoService disasterInfoService;

    public DisasterInfoController(IDisasterInfoService disasterInfoService) {
        this.disasterInfoService = disasterInfoService;
    }

    // Get All DisasterInfos
    @GetMapping
    public ResponseEntity<List<DisasterInfoDTO>> getAllDisasterInfos() {
        List<DisasterInfoDTO> disasterInfoDTOList = disasterInfoService.findAllDisasterInfos();
        return ResponseEntity.ok(disasterInfoDTOList);
    }

    @PostMapping(value = "/create" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<?> createDisasterInfo(@RequestPart("disasterInfo") DisasterInfoDTO disasterInfoDTO,
                                                @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {
        try {
            // Call service de tao thong tin disaster
            DisasterInfoDTO result = disasterInfoService.createDisasterInfo(disasterInfoDTO, imageFiles);

            // check result of service
            if (result != null) {
                return ResponseEntity.ok(result);  // DisasterInfoDTO và HTTP 200 OK
            } else {
                //  HTTP 400 Bad Request
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create disaster info.");
            }
        } catch (Exception e) {
            // HTTP 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<?> findDisasterInfoById(@PathVariable int id) {
        try {
            // Call the service to find the disaster info by ID
            DisasterInfoDTO disasterInfo = disasterInfoService.findDisasterInfoById(id);

            // Return the found DisasterInfoDTO with HTTP 200 OK status
            return ResponseEntity.ok(disasterInfo);
        } catch (RuntimeException e) {
            // Handle case where the disaster info does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // Handle any other errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> updateDisasterInfo(@PathVariable int id, @RequestBody DisasterInfoDTO disasterInfoDTO) {
        try {
            DisasterInfoDTO updatedInfo = disasterInfoService.updateDisasterInfo(id, disasterInfoDTO);
            return ResponseEntity.ok(updatedInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDisasterInfo(@PathVariable int id) {
        try {
            boolean isDeleted = disasterInfoService.deleteDisasterInfo(id);

            if (isDeleted) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // HTTP 204 No Content
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("DisasterInfo not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}
