package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.WeatherData;
import disasterwarning.com.vn.services.DisasterWarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disaster-warning-management")
public class DisasterWarningController {

    @Autowired
    private DisasterWarningService disasterWarningService;

    @GetMapping("/disaster-warning/{city}")
    public List<WeatherData> getWeatherData(@PathVariable String city) {
        return disasterWarningService.getWeatherData(city);
    }

    @GetMapping("/disaster-warning")
    public ResponseEntity<ResponseWrapper<List<DisasterWarningDTO>>> getAllDisasterWarnings() {
        List<DisasterWarningDTO> disasterWarningDTOS = disasterWarningService.findAllDisasterWarning();
        ResponseWrapper<List<DisasterWarningDTO>> responseWrapper;

        if (!disasterWarningDTOS.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Disaster Warning retrieved successfully", disasterWarningDTOS);
            return ResponseEntity.ok(responseWrapper);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster Warning is empty", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/disaster-warning/{id}")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> getDisasterWarnings(@PathVariable int id) {
        DisasterWarningDTO disasterWarningDTO = disasterWarningService.findDisasterWarningById(id);
        ResponseWrapper<DisasterWarningDTO> responseWrapper;

        if (disasterWarningDTO != null) {
            responseWrapper = new ResponseWrapper<>("Disaster Warning retrieved successfully", disasterWarningDTO);
            return ResponseEntity.ok(responseWrapper);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster Warning is empty", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/disaster-warning/{id}")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> deleteDisasterWarning(@PathVariable int id) {
        try {
            boolean deleted = disasterWarningService.deleteDisasterWarning(id);
            ResponseWrapper<Boolean> responseWrapper =
                    new ResponseWrapper<>("Disaster successfully deleted", deleted);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseWrapper<>(e.getMessage(), null));
        }
    }

    @PostMapping("/disaster-warning")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> createDisasterWarning(@RequestBody DisasterWarningDTO disasterWarningDTO) {
        DisasterWarningDTO disasterWarningDTONew = disasterWarningService.createDisasterWarning(disasterWarningDTO);
        ResponseWrapper<DisasterWarningDTO> responseWrapper;

        if (disasterWarningDTO != null) {
            responseWrapper = new ResponseWrapper<>("Disaster Warning successfully created", disasterWarningDTO);
            return new ResponseEntity<>(responseWrapper,HttpStatus.CREATED);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster Warning fail to create", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/disaster-warning/{id}")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> updateDisasterWarning(
            @PathVariable int id,
            @RequestBody DisasterWarningDTO disasterWarningDTO) {
        DisasterWarningDTO disasterWarningDTONew = disasterWarningService.updateDisasterWarning(id,disasterWarningDTO);
        ResponseWrapper<DisasterWarningDTO> responseWrapper;

        if (disasterWarningDTO != null) {
            responseWrapper = new ResponseWrapper<>("Disaster Warning successfully update", disasterWarningDTONew);
            return new ResponseEntity<>(responseWrapper,HttpStatus.CREATED);
        }
        else {
            responseWrapper = new ResponseWrapper<>("Disaster Warning fail to update", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
