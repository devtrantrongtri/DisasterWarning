package disasterwarning.com.vn.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.models.entities.Image;
import disasterwarning.com.vn.services.FileUploadService;
import disasterwarning.com.vn.services.IDisasterInfoService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/disaster-info-management")
@SecurityRequirement(name = "bearerAuth")
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

    @PostMapping(value = "/disaster-info", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<?>> createDisasterInfo(
            @Parameter(description = "Disaster Info DTO", required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\"typeInfo\": \"Wildfire\", \"information\": \"A wildfire is spreading rapidly in the northern region.\", \"disaster\": {\"disasterId\": 1}}"
                            )
                    ))
            @RequestParam("disasterInfo") String disasterInfo,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {

        try {
            // Chuyển đổi từ JSON String sang DisasterInfoDTO
            ObjectMapper objectMapper = new ObjectMapper();
            DisasterInfoDTO disasterInfoDTO = objectMapper.readValue(disasterInfo, DisasterInfoDTO.class);

            // Xử lý logic tiếp theo với disasterInfoDTO và imageFiles
            DisasterInfoDTO result = disasterInfoService.createDisasterInfo(disasterInfoDTO, imageFiles);

            if (result != null) {
                return ResponseEntity.ok(new ResponseWrapper<>("Created successfully", result));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseWrapper<>("Failed to create disaster info.", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseWrapper<>("An error occurred: " + e.getMessage(), null));
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

    @GetMapping("/disaster-info/{disasterId}")
    public ResponseEntity<ResponseWrapper<?>> getAllDisasterInfosByName(@PathVariable int disasterId) {
        try {
            List<DisasterInfoDTO> disasterInfoDTOList = disasterInfoService.findAllDisasterInfosByName(disasterId);
            return ResponseEntity.ok(new ResponseWrapper<>("get ok",disasterInfoDTOList));
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseWrapper<>("Disaster info not found.",null));
        }
    }

    @PutMapping("/disaster-info/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<?>> deleteDisasterInfo(@PathVariable int id) {
        try {
            disasterInfoService.deleteDisasterInfo(id);
            return ResponseEntity.ok(new ResponseWrapper<>("Deleted successfully", Boolean.TRUE));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseWrapper<>("Disaster info not found.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseWrapper<>("An error occurred: " + e.getMessage(), null));
        }
    }

}
