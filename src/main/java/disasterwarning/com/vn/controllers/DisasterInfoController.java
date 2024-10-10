package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
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
@RequestMapping("/disaster-info-management")
public class DisasterInfoController {
    private final IDisasterInfoService disasterInfoService;

    public DisasterInfoController(IDisasterInfoService disasterInfoService) {
        this.disasterInfoService = disasterInfoService;
    }

    // Get All DisasterInfos
    @GetMapping("/disaster-info")
    public ResponseEntity<ResponseWrapper<List<DisasterInfoDTO>>> getAllDisasterInfos() {
        List<DisasterInfoDTO> disasterInfoDTOList = disasterInfoService.findAllDisasterInfos();
        return ResponseEntity.ok(new ResponseWrapper<>("Get List ok",disasterInfoDTOList));
    }

    @PostMapping(value = "/disaster-info" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<ResponseWrapper<?>> createDisasterInfo(@RequestPart("disasterInfo") DisasterInfoDTO disasterInfoDTO,
                                                @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {
        try {
            // Call service de tao thong tin disaster
            DisasterInfoDTO result = disasterInfoService.createDisasterInfo(disasterInfoDTO, imageFiles);

            // check result of service
            if (result != null) {
                return ResponseEntity.ok(new ResponseWrapper<>("created ok",result));  // DisasterInfoDTO và HTTP 200 OK
            } else {
                //  HTTP 400 Bad Request
                return ResponseEntity.status( HttpStatus.BAD_REQUEST).body(new ResponseWrapper<>("Failed to create disaster info.",null));
            }
        } catch (Exception e) {
            // HTTP 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>("An error occurred: " + e.getMessage(),null) );
        }
    }

    @GetMapping("/disaster-info/{id}")
    public ResponseEntity<ResponseWrapper<?>> findDisasterInfoById(@PathVariable int id) {
        try {
            // Call the service to find the disaster info by ID
            DisasterInfoDTO disasterInfo = disasterInfoService.findDisasterInfoById(id);

            // Return the found DisasterInfoDTO with HTTP 200 OK status
            return ResponseEntity.ok(new ResponseWrapper<>("get ok",disasterInfo));
        } catch (RuntimeException e) {
            // Handle case where the disaster info does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseWrapper<>("Disaster info not found.",null));
        } catch (Exception e) {
            // Handle any other errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>("An error occurred: " + e.getMessage(),null));
        }
    }

    @PutMapping("/disaster-info/{id}")
    public ResponseEntity<ResponseWrapper<?>> updateDisasterInfo(@PathVariable int id, @RequestBody DisasterInfoDTO disasterInfoDTO) {
        try {
            DisasterInfoDTO updatedInfo = disasterInfoService.updateDisasterInfo(id, disasterInfoDTO);
            return ResponseEntity.ok(new ResponseWrapper<>("updated ok",updatedInfo));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseWrapper<>("Disaster info not found.",null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>("An error occurred: " + e.getMessage(),null));
        }
    }
    @DeleteMapping("/disaster-info/{id}")
    public ResponseEntity<ResponseWrapper<?>> deleteDisasterInfo(@PathVariable int id) {
        try {
            boolean isDeleted = disasterInfoService.deleteDisasterInfo(id);

            if (isDeleted) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // HTTP 204 No Content
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseWrapper<>("Disaster info not found.",null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>("An error occurred: " + e.getMessage(),null));
        }
    }
}
