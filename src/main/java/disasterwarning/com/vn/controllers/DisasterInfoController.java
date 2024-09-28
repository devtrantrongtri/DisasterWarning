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

}
