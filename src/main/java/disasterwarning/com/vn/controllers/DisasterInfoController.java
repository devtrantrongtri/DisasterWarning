package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import disasterwarning.com.vn.services.IDisasterInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
