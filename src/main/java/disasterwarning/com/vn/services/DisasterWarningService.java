package disasterwarning.com.vn.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.models.dtos.*;
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

import java.text.ParseException;
import java.text.SimpleDateFormat;

import java.util.*;

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
    private static final String AI_URL = "http://127.0.0.1:8000/predict/forecast?location=";

    @Override
    public DisasterWarningDTO createDisasterWarning(DisasterWarningDTO disasterWarningDTO){
        DisasterWarning newDisasterWarning = mapper.convertToEntity(disasterWarningDTO, DisasterWarning.class);
        String description = newDisasterWarning.getDescription();
        Date warningDate = newDisasterWarning.getStartDate();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = dateFormat.format(warningDate);

        DisasterWarning existingWarning = disasterWarningRepo.findDisasterWarningByDescription(description);

        if (existingWarning != null) {
            Date existingWarningDate = existingWarning.getStartDate();
            String existingFormattedDate = dateFormat.format(existingWarningDate);

            if (formattedDate.equals(existingFormattedDate)) {
                if (existingWarning.getLocation().getLocationId()==newDisasterWarning.getLocation().getLocationId()) {
                    throw new RuntimeException("Disaster warning already exists for this date");
                }
            }
        }

        if (newDisasterWarning.getDisaster() == null) {
            throw new RuntimeException("Disaster is null");
        } else {
            if (newDisasterWarning.getDisaster().getDisasterId() != 0) {
                DisasterDTO existingDisaster = disasterService.findDisasterById(newDisasterWarning.getDisaster().getDisasterId());
                if (existingDisaster == null) {
                    throw new RuntimeException("Disaster not found");
                }
            }
        }

        if (newDisasterWarning.getLocation() == null) {
            throw new RuntimeException("Location is null");
        } else {
            // Kiểm tra nếu LocationId không phải là 0 và tồn tại trong cơ sở dữ liệu
            if (newDisasterWarning.getLocation().getLocationId() != 0) {
                LocationDTO existingLocation = locationService.findLocationById(newDisasterWarning.getLocation().getLocationId());
                if (existingLocation == null) {
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

    public boolean deleteDisasterWarning(int id) {
        DisasterWarning disasterWarning = disasterWarningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster Warning not found"));
        disasterWarningRepo.delete(disasterWarning);
        return true;
    }

    public List<DisasterWarningDTO> getWeatherData(String city) {
        LocationDTO location = locationService.findLocationByName(city);
        String url = AI_URL + location.getLocationName() + "&days=7";
        System.out.println("Request URL: " + url);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        System.out.println("Response JSON: " + response); // Log JSON thô

        ObjectMapper objectMapper = new ObjectMapper();
        List<DisasterWarningDTO> disasterWarningDTOList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response);

            for (JsonNode dayNode : root) {
                // Lấy timestamp và parse thành Date
                String timestamp = dayNode.path("timestamp").asText();

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                Date date;
                try {
                    date = dateFormat.parse(timestamp);
                } catch (ParseException e) {
                    System.err.println("Error parsing timestamp: " + timestamp);
                    e.printStackTrace();
                    continue;
                }

                // Check for warning_message
                String warningMessage = dayNode.path("warning_message").asText(null);

                JsonNode disasterDescriptionsNode = dayNode.path("disaster_descriptions");

                if (disasterDescriptionsNode.isArray()) {
                    for (JsonNode disasterNode : disasterDescriptionsNode) {

                        String disaster = disasterNode.path("disaster").asText(null);
                        String description = disasterNode.path("disaster_description").asText(null);

                        if (disaster != null && description != null) {
                            DisasterWarningDTO disasterWarning = new DisasterWarningDTO();
                            disasterWarning.setDescription(description);
                            disasterWarning.setLocation(location);

                            DisasterDTO disasterDTO = disasterService.findDisasterByName(disasterName(disaster));

                            if (disasterDTO == null) {
                                System.err.println("Disaster not found: " + disaster);
                                throw new RuntimeException("Disaster not found: " + disaster);
                            }

                            disasterWarning.setDisaster(disasterDTO);
                            disasterWarning.setStartDate(date);

                            DisasterWarningDTO newDisasterWarning = createDisasterWarning(disasterWarning);

                            disasterWarningDTOList.add(newDisasterWarning);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing weather data");
            e.printStackTrace();
        }

        return disasterWarningDTOList;
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
            return "Lũ lụt";
        }
        else if(input.equals("storm")){
            return "Bão";
        }
        else if(input.equals("drought")){
            return "Hạn hán";
        }
        else if(input.equals("fog")){
            return "Sương mù";
        }
        else if(input.equals("tornado")){
            return "Lốc xoáy";
        }
        else if(input.equals("lightning")){
            return "Sấm sét";
        }
        else if(input.equals("landslide")){
            return "Sạt lở";
        }
        else if(input.equals("flash_flood")){
            return "Lũ quét";
        }
        else {
            return null;
        }
    }
}