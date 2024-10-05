package disasterwarning.com.vn.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.dtos.WeatherData;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.repositories.DisasterWarningRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class DisasterWarningService implements IDisasterWarningService {

    @Autowired
    private DisasterWarningRepo disasterWarningRepo;

    @Autowired
    private DisasterService disasterService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private Mapper mapper;

    @Value("${YOUR_API_KEY}")
    private String API_KEY;

    private static final String API_URL = "https://api.openweathermap.org/data/2.5/forecast";

    public List<WeatherData> getWeatherData(String city) {
        LocationDTO location = locationService.findLocationByName(city);
        String url = API_URL + "?lat=" + location.getLatitude() +"&lon=" + location.getLongitude() + "&appid=" + API_KEY;

        // Tạo RestTemplate để gọi API
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        // Tạo ObjectMapper để parse JSON
        ObjectMapper objectMapper = new ObjectMapper();
        List<WeatherData> weatherDataList = new ArrayList<>();

        try {

            JsonNode root = objectMapper.readTree(response);
            JsonNode listNode = root.path("list");
            for (JsonNode node : listNode) {
                WeatherData weatherData = objectMapper.treeToValue(node, WeatherData.class);
                weatherData.setCityName(location.getLocationName());
                weatherDataList.add(weatherData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return weatherDataList;
    }

    @Override
    public DisasterWarningDTO createDisasterWarning(DisasterWarningDTO disasterWarningDTO){
        DisasterWarning newDisasterWarning = mapper.convertToEntity(disasterWarningDTO, DisasterWarning.class);

        if(newDisasterWarning.getDisaster() == null){
            throw new RuntimeException("Disaster is null");
        }
        else {
            DisasterDTO existingDisaster = disasterService.findDisasterById(newDisasterWarning.getDisaster().getDisasterId());
            if(existingDisaster == null){
                throw new RuntimeException("Disaster not found");
            }
        }

        if(newDisasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            LocationDTO existingLocation = locationService.findLocationById(newDisasterWarning.getLocation().getLocationId());
            if(existingLocation == null){
                throw new RuntimeException("Location not found");
            }
        }

        disasterWarningRepo.save(newDisasterWarning);
        return mapper.convertToEntity(newDisasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public DisasterWarningDTO updateDisasterWarning(int id,DisasterWarningDTO disasterWarningDTO){
        DisasterWarning disasterWarning = mapper.convertToEntity(disasterWarningDTO, DisasterWarning.class);

        DisasterWarning updateDisasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        if(disasterWarning.getDisaster() == null){
            throw new RuntimeException("Disaster is null");
        }
        else {
            DisasterDTO existingDisaster = disasterService.findDisasterById(disasterWarning.getDisaster().getDisasterId());
            if(existingDisaster == null){
                throw new RuntimeException("Disaster not found");
            }
            updateDisasterWarning.setDisaster(disasterWarning.getDisaster());

        }

        if(disasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            LocationDTO existingLocation = locationService.findLocationById(disasterWarning.getLocation().getLocationId());
            if(existingLocation == null){
                throw new RuntimeException("Location not found");
            }
            updateDisasterWarning.setLocation(disasterWarning.getLocation());
        }

        updateDisasterWarning.setStartDate(disasterWarning.getStartDate());
        updateDisasterWarning.setEndDate(disasterWarning.getEndDate());
        updateDisasterWarning.setDescription(disasterWarning.getDescription());

        disasterWarningRepo.save(disasterWarning);
        return mapper.convertToEntity(disasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public DisasterWarningDTO findDisasterWarningById(int id){
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        return mapper.convertToEntity(disasterWarning, DisasterWarningDTO.class);
    }

    @Override
    public List<DisasterWarningDTO> findAllDisasterWarning(){
        List<DisasterWarning> disasterWarnings = disasterWarningRepo.findAll();
        if(disasterWarnings.isEmpty()){
            throw new RuntimeException("List Disaster Warning not found");
        }
        return mapper.convertToEntityList(disasterWarnings, DisasterWarningDTO.class);
    }

    public boolean deleteDisasterWarning(int id){
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        disasterWarningRepo.delete(disasterWarning);
        return true;
    }



    public String CheckDisasterWarning(WeatherData weatherData){
        if(weatherData == null){
            throw new RuntimeException("Weather data is empty");
        }

        double tempC = weatherData.getMain().getTemp() - 273.15;

        //Cảnh báo lũ
        if (weatherData.getRain().get_3h() >= 100) {
            return "Rain is too high"; //lũ quét
        } else if (weatherData.getRain().get_3h() >= 50) {
            return "Rain is high"; //lũ cục bộ
        }

        //Cảnh báo bão
        if (weatherData.getWind().getSpeed() >= 32.7) {
            return "Wind is high"; //siêu bão
        } else if (weatherData.getWind().getSpeed() >= 17.2) {
            return "Wind is too high"; //bão
        }

        //Cảnh báo áp suất thấp bất thường (có thể là dấu hiệu của bão)
        if (weatherData.getMain().getPressure() < 950) {
            return "Pressure is low"; //có thể có bão mạnh
        }

        if (tempC > 35) {
            return "Temperature is too high"; //Nhiệt độ cao
        } else if (tempC < 13) {
            return "Temperature is too low"; //Nhiệt độ thấp
        }

        return "0";
    }
}
