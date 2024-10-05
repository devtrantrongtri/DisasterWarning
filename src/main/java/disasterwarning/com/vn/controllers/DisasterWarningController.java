package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.WeatherData;
import disasterwarning.com.vn.services.DisasterWarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/disaster-warning")
public class DisasterWarningController {

    @Autowired
    private DisasterWarningService disasterWarningService;

    @GetMapping("/get/{city}")
    public List<WeatherData> getWeatherData(@PathVariable String city) {
        return disasterWarningService.getWeatherData(city);
    }
}
