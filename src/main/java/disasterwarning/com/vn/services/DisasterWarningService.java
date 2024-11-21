package disasterwarning.com.vn.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.models.dtos.*;
import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.repositories.DisasterWarningRepo;
import disasterwarning.com.vn.services.sendMail.IMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Date;
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
    private IMailService mailService;

    @Autowired
    private IUserService userService;

    @Autowired
    private Mapper mapper;

    @Value("${YOUR_API_KEY}")
    private String API_KEY;

    @Value("${Weather_API_KEY}")
    private String Weather_API_KEY;

    private static final String API_URL = "https://api.openweathermap.org/data/2.5/forecast";
    private static final String API_URL_WeatherAPI = "https://api.weatherapi.com/v1/forecast.json?q=";
    private static final String AI_URL = "http://127.0.0.1:8000/predict/forecast/daily?location=Qu%E1%BA%A3ng%20Ng%C3%A3i&days=7";

    // Wind speeds (m/s)
    public static final double SUPER_TYPHOON_WIND = 32.7;
    public static final double TYPHOON_WIND = 15.0;

    // Pressure (hPa)
    public static final double SUPER_TYPHOON_PRESSURE = 965;
    public static final double TYPHOON_PRESSURE = 980;

    // Rain (mm/h)
    public static final double EXTREME_RAIN = 35;
    public static final double HEAVY_RAIN = 3;

    // Temperature (°C)
    public static final double EXTREME_HOT = 41;
    public static final double VERY_HOT = 35;
    public static final double SEVERE_COLD = 10;
    public static final double COLD = 13;

    // Visibility (m)
    public static final double DENSE_FOG = 200;
    public static final double FOG = 1000;

    // Wind gusts (m/s)
    public static final double EXTREME_TORNADO = 70;
    public static final double SEVERE_TORNADO = 50;
    public static final double TORNADO = 33;

    // Humidity threshold for drought warning
    public static final double LOW_HUMIDITY = 30;

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
    public Page<DisasterWarningDTO> findAllDisasterWarning(Pageable pageable){
        Page<DisasterWarning> disasterWarnings = disasterWarningRepo.findAll(pageable);
        if(disasterWarnings.isEmpty()){
            throw new RuntimeException("List Disaster Warning not found");
        }
        return mapper.convertToDtoPage(disasterWarnings, DisasterWarningDTO.class);
    }

    public boolean deleteDisasterWarning(int id){
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));

        disasterWarningRepo.delete(disasterWarning);
        return true;
    }

    public List<DisasterWarningDTO> getWeatherData(String city) {
        LocationDTO location = locationService.findLocationByName(city);
        String url = API_URL_WeatherAPI + location.getLocationName() + "&days=7";
        System.out.println("Request URL: " + url);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        List<DisasterWarningDTO> disasterWarningDTOList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response);

            for (JsonNode dayNode : root) {
                String dateString = dayNode.path("timestamp").asText(); // Lấy timestamp
                Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateString);

                // Check for warning_message
                String warningMessage = dayNode.path("warning_message").asText(null);
                if (warningMessage != null) {

                    JsonNode disasterDescriptionsNode = dayNode.path("disaster_descriptions");
                    if (disasterDescriptionsNode.isArray()) {
                        for (JsonNode disasterNode : disasterDescriptionsNode) {
                            String disaster = disasterNode.path("disaster").asText(null);
                            String description = disasterNode.path("description").asText(null);

                            if (disaster != null && description != null) {
                                DisasterWarning disasterWarning = new DisasterWarning();
                                disasterWarning.setDescription(description);
                                disasterWarning.setLocation(mapper.convertToEntity(location, Location.class));

                                DisasterDTO disasterDTO = disasterService.findDisasterByName(disasterName(disaster));

                                if (disasterDTO == null) {
                                    throw new RuntimeException("Disaster not found: " + disaster);
                                }

                                disasterWarning.setDisaster(mapper.convertToEntity(disasterDTO, Disaster.class));
                                disasterWarning.setStartDate(date);

                                DisasterWarning newDisasterWarning = disasterWarningRepo.save(disasterWarning);

                                disasterWarningDTOList.add(mapper.convertToDto(newDisasterWarning, DisasterWarningDTO.class));
                            }
                        }
                    }

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return disasterWarningDTOList; // Trả về danh sách
    }


    public boolean sendDisasterWarning() {
        List<LocationDTO> locations = locationService.findAllLocations(Pageable.unpaged()).getContent();
        List<Location> locationList = mapper.convertToEntityList(locations, Location.class);
        boolean warningSent = false;

        if (locationList.isEmpty()) {
            System.out.println("Location List is empty");
            return false;
        }

        for (Location location : locationList) {
            List<DisasterWarningDTO> disasterWarningDTOS = getWeatherData(location.getLocationName());

            for (DisasterWarningDTO disasterWarningDTO : disasterWarningDTOS) {
                List<UserDTO> userDTOList = userService.findUsersByProvince(location.getLocationName());
                List<UserDTO> userActiveList = userDTOList.stream()
                        .filter(user -> "active".equals(user.getStatus()))
                        .toList();

                for (UserDTO user : userActiveList) {
                    mailService.sendMail(user.getEmail(), disasterWarningDTO);
                    warningSent = true;
                }
            }
        }

        return warningSent;
    }

    private String disasterName(String input){
        if(input.equals("flood")){
            return "Lũ Lụt";
        }
        else if(input.equals("storm")){
            return "Bão";
        }
        else if(input.equals("drought")){
            return "Hạn Hán";
        }
        else if(input.equals("fog")){
            return "Sương Mù";
        }
        else if(input.equals("tornado")){
            return "Lốc Xoáy";
        }
        else if(input.equals("lightning")){
            return "Sấm Sét";
        }
        else if(input.equals("landslide")){
            return "Sạt Lở";
        }
        else if(input.equals("flash_flood")){
            return "Lũ Quét";
        }
        else {
            return null;
        }
    }
}
