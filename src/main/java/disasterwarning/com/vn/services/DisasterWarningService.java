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



    public WeatherData CheckDisasterWarning(List<WeatherData> weatherDataList) {
        if (weatherDataList.isEmpty()) {
            throw new RuntimeException("Danh sách dữ liệu thời tiết trống");
        }

        for (WeatherData weatherData : weatherDataList) {

            if (weatherData.getMain() == null || weatherData.getRain() == null || weatherData.getWind() == null) {
                throw new RuntimeException("Dữ liệu thời tiết không đầy đủ");
            }

            double tempC = weatherData.getMain().getTemp() - 273.15;

            // Bão kèm lũ
            if (weatherData.getWind().getSpeed() >= 32.7 && weatherData.getRain().get_3h() >= 50) {
                weatherData.setDisasterName("Bão kèm lũ");
                weatherData.setMessage("CẢNH BÁO: Một cơn bão rất mạnh đang hình thành, kết hợp với lượng mưa lớn.\n" +
                        "Nguy cơ lũ lụt nghiêm trọng đang xảy ra. Hãy chuẩn bị di tản và bảo đảm an toàn.\n" +
                        "Kiểm tra và gia cố nhà cửa, dự trữ thực phẩm và nước uống.\n" +
                        "Tránh xa các khu vực trũng thấp hoặc gần sông suối.");
                return weatherData;
            }

            // Bão kèm sạt lở đất
            if (weatherData.getWind().getSpeed() >= 32.7 && continuousHeavyRain(weatherDataList)) {
                weatherData.setDisasterName("Bão kèm sạt lở đất");
                weatherData.setMessage("CẢNH BÁO: Cơn bão mạnh kèm theo mưa lớn liên tục.\n" +
                        "Nguy cơ sạt lở đất cao tại các khu vực đồi núi và ven sông.\n" +
                        "Hãy di tản khỏi các khu vực có nguy cơ và theo dõi thông báo từ cơ quan chức năng.");
                return weatherData;
            }

            // Lũ kèm sạt lở đất
            if (weatherData.getRain().get_3h() >= 50 && continuousHeavyRain(weatherDataList)) {
                weatherData.setDisasterName("Lũ kèm sạt lở đất");
                weatherData.setMessage("CẢNH BÁO: Mưa lớn kéo dài làm tăng nguy cơ lũ lụt và sạt lở đất.\n" +
                        "Các khu vực đồi núi, ven suối dễ bị ảnh hưởng nghiêm trọng.\n" +
                        "Hãy rời khỏi khu vực nguy hiểm và tìm nơi trú ẩn an toàn.");
                return weatherData;
            }

            // Bão lớn
            if (weatherData.getWind().getSpeed() >= 32.7) {
                weatherData.setDisasterName("Bão lớn");
                weatherData.setMessage("CẢNH BÁO: Gió mạnh vượt quá 32,7 m/s, cơn bão lớn sắp tới.\n" +
                        "Hãy gia cố nhà cửa, dự trữ thức ăn và nước uống.\n" +
                        "Tránh xa các khu vực ven biển hoặc nơi có nguy cơ cao.");
                return weatherData;
            } else if (weatherData.getWind().getSpeed() >= 17.2) {
                weatherData.setDisasterName("Bão");
                weatherData.setMessage("CẢNH BÁO: Gió mạnh trên 17,2 m/s, một cơn bão đang hình thành.\n" +
                        "Hãy chuẩn bị đối phó với bão, kiểm tra các thông tin thời tiết mới nhất.\n" +
                        "Hạn chế ra ngoài và đảm bảo các vật dụng dễ bị cuốn bay đã được cố định.");
                return weatherData;
            }

            // Lũ quét
            if (weatherData.getRain().get_3h() >= 100) {
                weatherData.setDisasterName("Lũ quét");
                weatherData.setMessage("CẢNH BÁO: Lượng mưa cực lớn trong 3 giờ qua, có nguy cơ xảy ra lũ quét.\n" +
                        "Hãy rời khỏi các khu vực trũng thấp, gần sông suối ngay lập tức.\n" +
                        "Nguy cơ nước dâng nhanh và có thể cuốn trôi các tài sản, phương tiện giao thông.");
                return weatherData;
            } else if (weatherData.getRain().get_3h() >= 50) {
                weatherData.setDisasterName("Lũ cục bộ");
                weatherData.setMessage("CẢNH BÁO: Mưa lớn kéo dài, nước đang dâng cao tại các khu vực cục bộ.\n" +
                        "Hãy theo dõi mực nước và di chuyển đến nơi an toàn nếu cần thiết.\n" +
                        "Kiểm tra hệ thống thoát nước và chuẩn bị sẵn sàng cho tình huống lũ xảy ra.");
                return weatherData;
            }

            // Sóng lớn và triều cường
            if (weatherData.getMain().getPressure() < 980 && weatherData.getWind().getSpeed() >= 15) {
                weatherData.setDisasterName("Sóng lớn và triều cường");
                weatherData.setMessage("CẢNH BÁO: Áp suất thấp và gió mạnh đang gây ra nguy cơ sóng lớn và triều cường.\n" +
                        "Các khu vực ven biển có nguy cơ cao chịu ảnh hưởng.\n" +
                        "Hãy tránh xa biển, không ra khơi và bảo đảm an toàn cho các phương tiện và tài sản.");
                return weatherData;
            }

            // Sạt lở đất
            if (weatherData.getRain().get_3h() >= 50 && continuousHeavyRain(weatherDataList)) {
                weatherData.setDisasterName("Sạt lở đất");
                weatherData.setMessage("CẢNH BÁO: Mưa lớn kéo dài làm tăng nguy cơ sạt lở đất nghiêm trọng.\n" +
                        "Các khu vực đồi núi, ven sông dễ bị tác động.\n" +
                        "Hãy di tản khỏi khu vực có nguy cơ và tìm nơi trú ẩn an toàn.");
                return weatherData;
            }

            // Hạn hán
            if (tempC > 35 && weatherData.getMain().getHumidity() < 30) {
                weatherData.setDisasterName("Hạn hán");
                weatherData.setMessage("CẢNH BÁO: Nhiệt độ cao và độ ẩm thấp, nguy cơ hạn hán đang diễn ra.\n" +
                        "Nguồn nước có thể cạn kiệt, ảnh hưởng đến sinh hoạt và sản xuất.\n" +
                        "Hãy tiết kiệm nước và thực hiện các biện pháp phòng chống hạn hán.");
                return weatherData;
            }

            // Nắng nóng và rét đậm
            if (tempC > 35) {
                weatherData.setDisasterName("Nắng nóng");
                weatherData.setMessage("CẢNH BÁO: Nhiệt độ trên 35°C, gây ra tình trạng nắng nóng gay gắt.\n" +
                        "Hãy hạn chế ra ngoài, uống đủ nước và sử dụng quạt hoặc điều hòa để hạ nhiệt.");
                return weatherData;
            } else if (tempC < 13) {
                weatherData.setDisasterName("Rét đậm");
                weatherData.setMessage("CẢNH BÁO: Nhiệt độ dưới 13°C, gây ra tình trạng rét đậm.\n" +
                        "Hãy mặc ấm và tránh tiếp xúc lâu với nhiệt độ lạnh để giữ sức khỏe.");
                return weatherData;
            }

            // Sương mù dày đặc
            if (weatherData.getVisibility() < 1000) {
                weatherData.setDisasterName("Sương mù dày đặc");
                weatherData.setMessage("CẢNH BÁO: Sương mù dày đặc làm giảm tầm nhìn xuống dưới 1000m.\n" +
                        "Hãy bật đèn pha khi lái xe và lái xe cẩn thận, đặc biệt ở những khu vực đông dân cư.");
                return weatherData;
            }

            // Lốc xoáy
            if (weatherData.getWind().getGust() > 33) {
                weatherData.setDisasterName("Lốc xoáy");
                weatherData.setMessage("CẢNH BÁO: Gió giật mạnh trên 33 m/s, nguy cơ cao xảy ra lốc xoáy.\n" +
                        "Hãy tìm nơi trú ẩn an toàn, tránh xa cửa sổ và các vật dễ bay.");
                return weatherData;
            }

            // Thời tiết nguy hiểm
            if (weatherData.getRain().get_3h() >= 50 && weatherData.getWind().getSpeed() >= 13.9) {
                weatherData.setDisasterName("Thời tiết nguy hiểm");
                weatherData.setMessage("CẢNH BÁO: Mưa lớn kèm theo gió mạnh, thời tiết nguy hiểm.\n" +
                        "Hãy theo dõi thông tin từ cơ quan chức năng và tránh ra ngoài nếu không cần thiết.");
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
