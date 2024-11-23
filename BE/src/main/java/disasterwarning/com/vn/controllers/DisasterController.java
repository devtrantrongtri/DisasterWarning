package disasterwarning.com.vn.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.services.DisasterService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/disaster-management")
@SecurityRequirement(name = "bearerAuth")
public class DisasterController {

    @Autowired
    private DisasterService disasterService;


    @GetMapping("/disaster")
    public ResponseEntity<ResponseWrapper<Page<DisasterDTO>>> getAllDisaster(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<DisasterDTO> disasters = disasterService.findAllDisaster(pageable);
        ResponseWrapper<Page<DisasterDTO>> responseWrapper;

        if (disasters != null && !disasters.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Disaster retrieved successfully", disasters);
            return ResponseEntity.ok(responseWrapper);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("disaster/{id}")
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


    @PostMapping(value = "disaster" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<DisasterDTO>> createDisaster
            (@Parameter(description = "Disaster DTO", required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\"disasterName\": \"string\", \"description\": \"string\"}"
                            )
                    ))
             @RequestParam("disaster") String disasterReq ,
             @RequestPart(value = "images", required = false) MultipartFile images) {
        try {
            // Chuyển đổi từ JSON String sang DisasterInfoDTO
            ObjectMapper objectMapper = new ObjectMapper();
            DisasterDTO disasterDTO = objectMapper.readValue(disasterReq, DisasterDTO.class);
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


    @PutMapping("disaster/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<DisasterDTO>> updateDisaster
            (@Parameter(description = "Disaster DTO", required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\"disasterName\": \"string\", \"description\": \"string\"}"
                            )
                    ))
             @PathVariable int id,
             @RequestParam("disaster") String disasterReq ,
             @RequestPart(value = "images", required = false) MultipartFile images) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            DisasterDTO disasterDTO = objectMapper.readValue(disasterReq, DisasterDTO.class);
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

    @DeleteMapping("disaster/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
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
