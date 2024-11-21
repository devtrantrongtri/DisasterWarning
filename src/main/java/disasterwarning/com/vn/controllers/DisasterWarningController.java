package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.UserLocation;
import disasterwarning.com.vn.models.dtos.WeatherData;
import disasterwarning.com.vn.services.DisasterWarningService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Controller
@RequestMapping("/disaster-warning-management")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class DisasterWarningController {

    @Autowired
    private DisasterWarningService disasterWarningService;

    @GetMapping("/{city}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<DisasterWarningDTO>> getWeatherData(@PathVariable String city) {
        String decodedCity = URLDecoder.decode(city, StandardCharsets.UTF_8);

        List<DisasterWarningDTO> disasterWarningDTOS = disasterWarningService.getWeatherData(decodedCity);

        if (disasterWarningDTOS == null || disasterWarningDTOS.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(disasterWarningDTOS);
    }

    @GetMapping("/disaster-warning")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Page<DisasterWarningDTO>>> getAllDisasterWarnings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<DisasterWarningDTO> disasterWarningDTOS = disasterWarningService.findAllDisasterWarning(pageable);
        ResponseWrapper<Page<DisasterWarningDTO>> responseWrapper = new ResponseWrapper<>(
                disasterWarningDTOS.isEmpty() ? "Disaster Warning is empty" : "Disaster Warning retrieved successfully",
                disasterWarningDTOS.isEmpty() ? null : disasterWarningDTOS
        );
        HttpStatus status = disasterWarningDTOS.isEmpty() ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(responseWrapper, status);
    }

    @GetMapping("/disaster-warning/{id}")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> getDisasterWarnings(@PathVariable int id) {
        DisasterWarningDTO disasterWarningDTO = disasterWarningService.findDisasterWarningById(id);
        ResponseWrapper<DisasterWarningDTO> responseWrapper = new ResponseWrapper<>(
                disasterWarningDTO != null ? "Disaster Warning retrieved successfully" : "Disaster Warning is empty",
                disasterWarningDTO
        );
        HttpStatus status = disasterWarningDTO != null ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(responseWrapper, status);
    }

    @DeleteMapping("/disaster-warning/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<String>> deleteDisasterWarning(@PathVariable int id) {
        try {
            boolean check = disasterWarningService.deleteDisasterWarning(id);

            if (check) {
                return ResponseEntity.ok(new ResponseWrapper<>("Cảnh báo thiên tai đã được xóa thành công", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseWrapper<>("Không tìm thấy cảnh báo thiên tai với ID: " + id, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseWrapper<>(e.getMessage(), null));
        }
    }


    @PostMapping("/disaster-warning")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> createDisasterWarning(@RequestBody DisasterWarningDTO disasterWarningDTO) {
        DisasterWarningDTO disasterWarningDTONew = disasterWarningService.createDisasterWarning(disasterWarningDTO);
        ResponseWrapper<DisasterWarningDTO> responseWrapper = new ResponseWrapper<>(
                disasterWarningDTONew != null ? "Disaster Warning successfully created" : "Disaster Warning fail to create",
                disasterWarningDTONew
        );
        HttpStatus status = disasterWarningDTONew != null ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(responseWrapper, status);
    }

    @PutMapping("/disaster-warning/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<DisasterWarningDTO>> updateDisasterWarning(
            @PathVariable int id,
            @RequestBody DisasterWarningDTO disasterWarningDTO) {
        DisasterWarningDTO disasterWarningDTONew = disasterWarningService.updateDisasterWarning(id, disasterWarningDTO);
        ResponseWrapper<DisasterWarningDTO> responseWrapper = new ResponseWrapper<>(
                disasterWarningDTONew != null ? "Disaster Warning successfully updated" : "Disaster Warning fail to update",
                disasterWarningDTONew
        );
        HttpStatus status = disasterWarningDTONew != null ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(responseWrapper, status);
    }

    @MessageMapping("/disaster.sendWarning")
    @SendTo("/topic/warnings")
    public ResponseWrapper<String> sendWarning() {
        try {
            boolean warningSent = disasterWarningService.sendDisasterWarning();
            String message = warningSent ? "Cảnh báo thiên tai đã được gửi thành công" : "Không có cảnh báo thiên tai nào cần gửi";
            return new ResponseWrapper<>(message, null);
        } catch (DataNotFoundException e) {
            return new ResponseWrapper<>("Không tìm thấy dữ liệu", e.getMessage());
        } catch (Exception e) {
            return new ResponseWrapper<>("Lỗi khi gửi cảnh báo", e.getMessage());
        }
    }

    @MessageMapping("/location") // Nhận tin nhắn từ /app/location
    @SendTo("/topic/locations") // Gửi tin nhắn tới /topic/locations
    public UserLocation sendLocation(UserLocation location) {
        //TODO :  Xử lý hoặc lưu trữ vị trí
        log.info("New user access :{}",location);
        return location;
    }

}
