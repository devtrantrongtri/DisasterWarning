package disasterwarning.com.vn.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.models.dtos.DisasterDTO;
import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import disasterwarning.com.vn.models.dtos.LocationDTO;
import disasterwarning.com.vn.models.dtos.WeatherData;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.repositories.DisasterWarningRepo;
import disasterwarning.com.vn.repositories.LocationRepo;
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
    private LocationRepo locationRepo;

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
            if(newDisasterWarning.getDisaster().getDisasterId() != 0){
                DisasterDTO existingDisaster = disasterService.findDisasterById(newDisasterWarning.getDisaster().getDisasterId());
                if(existingDisaster == null){
                    throw new RuntimeException("Disaster not found");
                }
            }
        }

        if(newDisasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            if(newDisasterWarning.getLocation().getLocationId() != 0){
                LocationDTO existingLocation = locationService.findLocationById(newDisasterWarning.getLocation().getLocationId());
                if(existingLocation == null){
                    throw new RuntimeException("Location not found");
                }
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
            if(disasterWarningDTO.getDisaster().getDisasterId() != 0){
                DisasterDTO existingDisaster = disasterService.findDisasterById(disasterWarning.getDisaster().getDisasterId());
                if(existingDisaster == null){
                    throw new RuntimeException("Disaster not found");
                }
                updateDisasterWarning.setDisaster(disasterWarning.getDisaster());
            }

        }

        if(disasterWarning.getLocation() == null){
            throw new RuntimeException("Location is null");
        }
        else {
            if(disasterWarningDTO.getLocation().getLocationId() != 0){
                LocationDTO existingLocation = locationService.findLocationById(disasterWarning.getLocation().getLocationId());
                if(existingLocation == null){
                    throw new RuntimeException("Location not found");
                }
                updateDisasterWarning.setLocation(disasterWarning.getLocation());
            }
        }

        updateDisasterWarning.setStartDate(disasterWarning.getStartDate());
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

    public DisasterWarningDTO sendDisasterWarning() {
        List<LocationDTO> locations = locationService.findAllLocations();
        List<Location> locationList = mapper.convertToEntityList(locations, Location.class);
        if (locationList.isEmpty()) {
            throw new DataNotFoundException("Location List is empty");
        }
        DisasterWarning disasterWarning  = new DisasterWarning();
        for (Location location : locationList){
            List<WeatherData> weatherData = getWeatherData(location.getLocationName());
            if (weatherData.isEmpty()) {
                throw new DataNotFoundException("Weather Data is empty");
            }
            WeatherData alert = CheckDisasterWarning(weatherData);
            if (alert.getMessage().equals("Rain is too high")) {
                Location locationRepoByName = locationRepo.findByName(location.getLocationName());
                disasterWarning.setLocation(locationRepoByName);
                disasterWarning.setDescription("Cảnh báo: Lượng mưa lớn có nguy cơ gây lũ quét tại khu vực \" + location.getLocationName() + \". Khuyến nghị người dân thực hiện các biện pháp phòng tránh, tuân thủ hướng dẫn của cơ quan chức năng và di dời đến nơi an toàn nếu cần thiết.");
                disasterWarningRepo.save(disasterWarning);
            }
        }
        return mapper.convertToEntity(disasterWarning, DisasterWarningDTO.class);
    }



    public WeatherData CheckDisasterWarning(List<WeatherData> weatherDataList){
        if(weatherDataList.isEmpty()){
            throw new RuntimeException("Weather data is empty");
        }

        for(WeatherData weatherData : weatherDataList) {

            // Kiểm tra nếu các giá trị
            if (weatherData.getMain() == null || weatherData.getRain() == null || weatherData.getWind() == null) {
                throw new RuntimeException("Incomplete weather data");
            }

            double tempC = weatherData.getMain().getTemp() - 273.15;

            //Cảnh báo lũ
            if (weatherData.getRain().get_3h() >= 100) {
                weatherData.setMessage("Rain is too high");
                weatherData.setDisasterName("flood");
                return weatherData; //lũ quét
            } else if (weatherData.getRain().get_3h() >= 50) {
                weatherData.setDisasterName("flood");
                weatherData.setMessage("Rain is high");
                return weatherData; //lũ cục bộ
            }

            // Cảnh báo sạt lở đất
            if (weatherData.getRain().get_3h() >= 50 && continuousHeavyRain(weatherDataList)) {
                weatherData.setDisasterName("earthquake");
                weatherData.setMessage("High risk of landslide due to continuous heavy rainfall");
                return weatherData;
            }

            //Cảnh báo bão
            if (weatherData.getWind().getSpeed() >= 32.7) {
                weatherData.setDisasterName("storm");
                weatherData.setMessage("Wind is high");//siêu bão
                return weatherData;
            } else if (weatherData.getWind().getSpeed() >= 17.2) {
                weatherData.setDisasterName("storm");
                weatherData.setMessage("Wind is too high");//bão
                return weatherData;
            }

            //Cảnh báo áp suất thấp bất thường (có thể là dấu hiệu của bão)
            if (weatherData.getMain().getPressure() < 950) {
                weatherData.setMessage("Pressure is low"); //có thể có bão mạnh
            }


            if (tempC > 35 && weatherData.getMain().getHumidity() < 30) {
                weatherData.setMessage("Warning: Drought risk (High temperature with low humidity");
                return weatherData;
            }

            //Cảnh báo nắng nóng và rét đậm
            if (tempC > 35) {
                weatherData.setMessage("Temperature is too high");//Nhiệt độ cao
                return weatherData;
            } else if (tempC < 13) {
                weatherData.setMessage("Temperature is too low");//Nhiệt độ thấp
                return weatherData;
            }

            if (weatherData.getVisibility() < 1000) {
                weatherData.setMessage("Dense fog");
                return weatherData;
            }

            if (weatherData.getWind().getGust() > 33) {
                weatherData.setMessage("Tornado risk (Strong wind gusts)");
                return weatherData;
            }

            if (weatherData.getMain().getPressure() < 980 && weatherData.getWind().getSpeed() >= 15) {
                weatherData.setMessage("Risk of large waves and storm surge");
                return weatherData;
            }

            if (weatherData.getRain().get_3h() >= 50 && weatherData.getWind().getSpeed() >= 13.9) {
                weatherData.setMessage("Severe weather warning");// Thời tiết nguy hiểm
                return weatherData;
            }
        }
        return null;
    }

    private boolean continuousHeavyRain(List<WeatherData> weatherDataList) {
        int heavyRainCount = 0;

        for (WeatherData weatherData : weatherDataList) {
            if (weatherData.getRain() != null && weatherData.getRain().get_3h() >= 50) {
                heavyRainCount++;
            } else {
                heavyRainCount = 0;
            }

            if (heavyRainCount >= 3) { // Giả sử mưa lớn liên tục trong 3 chu kỳ (9h) là nguy hiểm
                return true;
            }
        }
        return false;
    }
}
