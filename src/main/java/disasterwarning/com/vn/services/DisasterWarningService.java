package disasterwarning.com.vn.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import disasterwarning.com.vn.models.dtos.*;
import disasterwarning.com.vn.models.entities.DisasterWarning;
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

    public List<WeatherData> getWeatherData(String city) {
        LocationDTO location = locationService.findLocationByName(city);
        String url = API_URL_WeatherAPI + location.getLatitude() + "%2C" + location.getLongitude()
                + "&days=14&key=" + Weather_API_KEY;
        System.out.println("Request URL: " + url);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        List<WeatherData> weatherDataList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode forecastNode = root.path("forecast").path("forecastday");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            for (JsonNode dayNode : forecastNode) {
                String dateString = dayNode.path("date").asText();  // Lấy ngày dưới dạng chuỗi
                Date date = sdf.parse(dateString);
                Double maxwind_kph = dayNode.path("day").path("maxwind_kph").asDouble();
                Double totalprecip_mm = dayNode.path("day").path("totalprecip_mm").asDouble();
                Double maxtemp_c = dayNode.path("day").path("maxtemp_c").asDouble();
                Double mintemp_c = dayNode.path("day").path("mintemp_c").asDouble();
                Double avghumidity = dayNode.path("day").path("avghumidity").asDouble();

                // Xử lý dữ liệu theo giờ để tìm lượng mây cao nhất trong ngày
                JsonNode hoursNode = dayNode.path("hour");
                Double maxCloudCoverage = 0.0;  // Biến để lưu lượng mây cao nhất trong ngày
                Double maxpressure_mb = 0.0;

                // Duyệt qua các giờ trong ngày để tìm lượng mây cao nhất
                for (JsonNode hourNode : hoursNode) {
                    Double cloudCoverage = hourNode.path("cloud").asDouble();
                    Double pressure_mb = hourNode.path("pressure_mb").asDouble();
                    if (cloudCoverage > maxCloudCoverage) {
                        maxCloudCoverage = cloudCoverage;
                    }
                    if (pressure_mb > maxpressure_mb) {
                        maxpressure_mb = pressure_mb;
                    }
                }

                // Tạo đối tượng WeatherData với lượng mây cao nhất
                WeatherData weatherData = new WeatherData(date, location.getLatitude(), location.getLongitude(),
                        maxwind_kph, totalprecip_mm, maxtemp_c, mintemp_c, maxpressure_mb, avghumidity, maxCloudCoverage);

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

//    public boolean sendDisasterWarning() {
//        List<LocationDTO> locations = locationService.findAllLocations(Pageable.unpaged()).getContent();
//        List<Location> locationList = mapper.convertToEntityList(locations, Location.class);
//        boolean warningSent = false;
//
//        if (locationList.isEmpty()) {
//            System.out.println("Location List is empty");
//            return false;
//        }
//
//        for (Location location : locationList) {
//            List<WeatherData> weatherData = getWeatherData(location.getLocationName());
//
//            if (weatherData.isEmpty()) {
//                System.out.println("Weather data is empty for location: " + location.getLocationName());
//                continue;
//            }
//
//            DisasterWarningDTO disasterWarningDTO = CheckDisasterWarning(weatherData);
//
//            if (disasterWarningDTO.getDisaster() != null) {
//                List<UserDTO> userDTOList = userService.findUsersByProvince(location.getLocationName());
//                List<UserDTO> userActiveList = userDTOList.stream()
//                        .filter(user -> "active".equals(user.getStatus()))
//                        .toList();
//
//                for (UserDTO user : userActiveList) {
//                    mailService.sendMail(user.getEmail(), disasterWarningDTO);
//                    warningSent = true;
//                }
//            }
//        }
//        return warningSent;
//    }


//    public DisasterWarningDTO CheckDisasterWarning(List<WeatherData> weatherDataList) {
//        if (weatherDataList.isEmpty()) {
//            throw new RuntimeException("Weather data is empty");
//        }
//
//        for (WeatherData weatherData : weatherDataList) {
//            // Kiểm tra nếu các giá trị
//            if (weatherData.getMain() == null && weatherData.getWind() == null) {
//                throw new RuntimeException("Incomplete weather data");
//            }
//
//            DisasterWarningDTO warning;
//
//            // 1. Tornado warnings
//            warning = checkTornadoWarning(weatherData);
//            if (warning != null) return warning;
//
//            // 2. Storm warnings
//            warning = checkStormWarning(weatherData);
//            if (warning != null) return warning;
//
//            // 3. Pressure Warnings
//            warning = checkPressureWarning(weatherData);
//            if (warning != null) return warning;
//
//            // 4. Rain Warnings
//            if (weatherData.getRain() != null) {
//                warning = checkRainWarning(weatherData, weatherDataList);
//                if (warning != null) return warning;
//            }
//
//            // 5. Temperature Warnings
//            warning = checkTemperatureWarning(weatherData);
//            if (warning != null) return warning;
//
//            // 6. Visibility Warnings
//            warning = checkVisibilityWarning(weatherData);
//            if (warning != null) return warning;
//        }
//        return null;
//    }
//
    private DisasterWarningDTO checkTornadoWarning(WeatherData weatherData) {
        // Lấy tốc độ gió giật từ dữ liệu thời tiết
        double gustSpeed = weatherData.getMaxwind_kph();
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon()) ;
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Lốc xoáy");
        disasterWarningDTO.setStartDate(weatherData.getDate());

        // Cảnh báo lốc xoáy cực kỳ nguy hiểm (EXTREME_TORNADO)
        if (gustSpeed > EXTREME_TORNADO) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);
            String description = String.format("CẢNH BÁO KHẨN CẤP: Lốc xoáy cực kỳ nguy hiểm với sức gió giật %,.1f m/s. " +
                            "Khuyến cáo: Người dân cần di chuyển ngay đến nơi trú ẩn kiên cố, tránh xa khu vực có các vật dễ bay, " +
                            "đổ. Đóng chặt cửa và cửa sổ. Chuẩn bị các vật dụng cần thiết và theo dõi thông báo liên tục.",
                    gustSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo lốc xoáy mạnh (SEVERE_TORNADO)
        } else if (gustSpeed > SEVERE_TORNADO) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO: Nguy cơ lốc xoáy mạnh với sức gió giật %,.1f m/s. " +
                            "Khuyến cáo: Người dân hạn chế ra ngoài, tìm nơi trú ẩn an toàn, " +
                            "gia cố mái nhà và các công trình xung quanh. Chuẩn bị sẵn sàng phương án sơ tán khi có lệnh.",
                    gustSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo lốc xoáy bình thường (TORNADO)
        } else if (gustSpeed > TORNADO) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO: Có khả năng xảy ra lốc xoáy với sức gió giật %,.1f m/s. " +
                            "Khuyến cáo: Theo dõi thông tin thời tiết liên tục. Chuẩn bị các phương án phòng tránh, " +
                            "gia cố nhà cửa và các công trình.",
                    gustSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private DisasterWarningDTO checkStormWarning(WeatherData weatherData) {
        // Lấy tốc độ gió từ dữ liệu thời tiết
        double windSpeed = weatherData.getMaxwind_kph();
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon());
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Bão");
        Date date = new Date();
        disasterWarningDTO.setStartDate(date);

        // Cảnh báo siêu bão (SUPER_TYPHOON_WIND)
        if (windSpeed >= SUPER_TYPHOON_WIND) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO SIÊU BÃO: Gió mạnh cấp %d (%,.1f m/s). " +
                            "Khuyến cáo: TUYỆT ĐỐI KHÔNG ra ngoài trong thời điểm này. " +
                            "Sơ tán khẩn cấp khỏi các khu vực ven biển, vùng trũng thấp. " +
                            "Nguy cơ cao xảy ra lũ quét, sạt lở đất và ngập lụt. " +
                            "Chuẩn bị lương thực và nước uống cho 3-5 ngày.",
                    getBeaufortScale(windSpeed), windSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo bão (TYPHOON_WIND)
        } else if (windSpeed >= TYPHOON_WIND) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO BÃO: Gió mạnh cấp %d (%,.1f m/s). " +
                            "Khuyến cáo: Không ra khơi, di chuyển tàu thuyền về nơi trú ẩn an toàn. " +
                            "Gia cố mái nhà, kho tàng. Chuẩn bị các phương án phòng chống ngập lụt. " +
                            "Sẵn sàng sơ tán khi có lệnh.",
                    getBeaufortScale(windSpeed), windSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private DisasterWarningDTO checkPressureWarning(WeatherData weatherData) {
        // Lấy áp suất và tốc độ gió từ dữ liệu thời tiết
        double pressure = weatherData.getPressure_mb();
        double windSpeed = weatherData.getMaxwind_kph();
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon()) ;
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Áp thấp nhiệt đới");
        Date date = new Date();
        disasterWarningDTO.setStartDate(date);

        // Cảnh báo áp thấp nhiệt đới mạnh (SUPER_TYPHOON_PRESSURE)
        if (pressure < SUPER_TYPHOON_PRESSURE) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO ÁP THẤP NHIỆT ĐỚI MẠNH: Áp suất xuống thấp bất thường (%,.1f hPa). " +
                            "Dấu hiệu hình thành siêu bão. Khuyến cáo: Theo dõi chặt chẽ diễn biến thời tiết. " +
                            "Chuẩn bị các phương án ứng phó với siêu bão. " +
                            "Sẵn sàng phương án di dời dân khỏi các khu vực nguy hiểm.",
                    pressure);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo áp thấp nhiệt đới (TYPHOON_PRESSURE) kèm gió mạnh
        } else if (pressure < TYPHOON_PRESSURE && windSpeed >= 15) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO ÁP THẤP NHIỆT ĐỚI: Áp suất thấp (%,.1f hPa) kèm gió mạnh (%,.1f m/s). " +
                            "Có khả năng phát triển thành bão. Khuyến cáo: Theo dõi thông tin thời tiết liên tục. " +
                            "Sẵn sàng các phương án phòng chống bão. " +
                            "Hạn chế ra khơi.",
                    pressure, windSpeed);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private DisasterWarningDTO checkRainWarning(WeatherData weatherData, List<WeatherData> weatherDataList) {
        // Lấy lượng mưa trong 3 giờ và tính ra lượng mưa mỗi giờ
        double rainPerHour = weatherData.getTotalprecip_mm()/24;
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon()) ;
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Lũ lụt");
        Date date = new Date();
        disasterWarningDTO.setStartDate(date);

        // Cảnh báo mưa cực lớn dẫn đến nguy cơ lũ quét (EXTREME_RAIN)
        if (rainPerHour >= EXTREME_RAIN) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO LŨ QUÉT: Mưa cực lớn với lượng mưa %,.1f mm/giờ. " +
                            "Nguy cơ rất cao xảy ra lũ quét và sạt lở đất tại các khu vực trũng thấp, ven sông suối và vùng núi. " +
                            "Khuyến cáo: Sẵn sàng phương án sơ tán khẩn cấp. Không đi lại khi không cần thiết. " +
                            "Chủ động di chuyển tài sản lên cao.",
                    rainPerHour);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo mưa lớn (HEAVY_RAIN) kèm gió mạnh
        } else if (rainPerHour >= HEAVY_RAIN) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            if (weatherData.getMaxwind_kph() >= 13.9) {
                String description = String.format("CẢNH BÁO THỜI TIẾT NGUY HIỂM: Mưa lớn %,.1f mm/giờ kèm gió mạnh. " +
                                "Nguy cơ cao xảy ra ngập úng cục bộ tại các vùng trũng thấp. Khuyến cáo: Hạn chế ra đường, đề phòng cây xanh bị đổ. " +
                                "Chú ý các biện pháp thoát nước để tránh ngập úng.",
                        rainPerHour);
                disasterWarningDTO.setDescription(description);
                return createDisasterWarning(disasterWarningDTO);
            } else if (continuousHeavyRain(weatherDataList)) {
                String description = String.format("CẢNH BÁO SẠT LỞ ĐẤT: Mưa lớn kéo dài với lượng mưa %,.1f mm/giờ. " +
                                "Nguy cơ cao xảy ra sạt lở đất tại các khu vực đồi núi dốc. Khuyến cáo: Người dân cần di chuyển khỏi các khu vực có nguy cơ sạt lở. " +
                                "Không đi lại qua các khu vực đồi núi dốc trong mưa lớn.",
                        rainPerHour);
                disasterWarningDTO.setDescription(description);
                return createDisasterWarning(disasterWarningDTO);
            } else {
                String description = String.format("CẢNH BÁO NGẬP LỤT CỤC BỘ: Mưa lớn với lượng mưa %,.1f mm/giờ. " +
                                "Đề phòng ngập úng tại các khu vực trũng thấp. Khuyến cáo: Theo dõi thông tin thời tiết. " +
                                "Chuẩn bị các phương án ứng phó với ngập lụt.",
                        rainPerHour);
                disasterWarningDTO.setDescription(description);
                return createDisasterWarning(disasterWarningDTO);
            }
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private DisasterWarningDTO checkTemperatureWarning(WeatherData weatherData) {
        double Maxtemp_c = weatherData.getMaxtemp_c();
        double Mintemp_c = weatherData.getMintemp_c();
        double avghumidity = weatherData.getAvghumidity();
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon()) ;
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Nhiệt độ bất thường");
        Date date = new Date();
        disasterWarningDTO.setStartDate(date);

        // Cảnh báo nắng nóng gay gắt
        if (Maxtemp_c > EXTREME_HOT) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO NẮNG NÓNG GAY GẮT: Nhiệt độ cao bất thường %,.1f°C. " +
                            "Khuyến cáo: Hạn chế tối đa hoạt động ngoài trời từ 10h-16h. " +
                            "Giữ đủ nước cho cơ thể, tránh say nắng. " +
                            "Đặc biệt chú ý đến người già, trẻ em và người có bệnh nền.",
                    Maxtemp_c);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo nắng nóng và khô hạn
        } else if (Maxtemp_c > VERY_HOT) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            if (avghumidity < LOW_HUMIDITY) {
                String description = String.format("CẢNH BÁO NẮNG NÓNG VÀ KHÔ HẠN: Nhiệt độ cao %,.1f°C, độ ẩm thấp %,.1f%%. " +
                                "Nguy cơ cao xảy ra hạn hán và cháy rừng. " +
                                "Khuyến cáo: Tiết kiệm nguồn nước. " +
                                "Phòng chống cháy nổ và cháy rừng. " +
                                "Hạn chế hoạt động ngoài trời.",
                        Maxtemp_c, avghumidity);
                disasterWarningDTO.setDescription(description);
                return createDisasterWarning(disasterWarningDTO);
            } else {
                String description = String.format("CẢNH BÁO NẮNG NÓNG: Nhiệt độ cao %,.1f°C. " +
                                "Khuyến cáo: Hạn chế hoạt động ngoài trời từ 11h-15h. " +
                                "Bổ sung đủ nước, đề phòng say nắng. " +
                                "Người già và trẻ em cần đặc biệt chú ý.",
                        Maxtemp_c);
                disasterWarningDTO.setDescription(description);
                return createDisasterWarning(disasterWarningDTO);
            }
            // Cảnh báo rét hại
        } else if (Mintemp_c < SEVERE_COLD) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO RÉT HẠI: Nhiệt độ xuống thấp %,.1f°C. " +
                            "Nguy cơ cao ảnh hưởng đến sức khỏe con người, vật nuôi và hoa màu. " +
                            "Khuyến cáo: Giữ ấm cơ thể, nhất là người già và trẻ nhỏ. " +
                            "Che chắn, bảo vệ vật nuôi và cây trồng. " +
                            "Phòng chống đột quỵ do thời tiết.",
                    Mintemp_c);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo rét đậm
        } else if (Mintemp_c < COLD) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO RÉT ĐẬM: Nhiệt độ thấp %,.1f°C. " +
                            "Khuyến cáo: Giữ ấm cơ thể, đặc biệt là người già và trẻ em. " +
                            "Che chắn cho vật nuôi và cây trồng. " +
                            "Phòng tránh các bệnh do thời tiết lạnh.",
                    Mintemp_c);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private DisasterWarningDTO checkVisibilityWarning(WeatherData weatherData) {
        double visibility = weatherData.getAvghumidity();
        DisasterWarningDTO disasterWarningDTO = new DisasterWarningDTO();
        LocationDTO locationDTO = locationService.findByLatAndLon(weatherData.getLat(),weatherData.getLon()) ;
        DisasterDTO disasterDTO = disasterService.findDisasterByName("Sương mù");
        Date date = new Date();
        disasterWarningDTO.setStartDate(date);

        // Cảnh báo sương mù dày đặc
        if (visibility < DENSE_FOG) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO SƯƠNG MÙ DÀY ĐẶC: Tầm nhìn xa cực kỳ hạn chế dưới %,.0f mét. " +
                            "Khuyến cáo: Tránh di chuyển khi không cần thiết. " +
                            "Nếu phải di chuyển: Bật đèn sương mù, giảm tốc độ, giữ khoảng cách an toàn. " +
                            "Đề phòng va chạm giao thông.",
                    visibility);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
            // Cảnh báo sương mù
        } else if (visibility < FOG) {
            disasterWarningDTO.setLocation(locationDTO);
            disasterWarningDTO.setDisaster(disasterDTO);

            String description = String.format("CẢNH BÁO SƯƠNG MÙ: Tầm nhìn xa hạn chế dưới %,.0f mét. " +
                            "Khuyến cáo: Khi di chuyển cần bật đèn sương mù, giảm tốc độ, " +
                            "giữ khoảng cách an toàn với phương tiện phía trước. " +
                            "Đề phòng tai nạn giao thông.",
                    visibility);
            disasterWarningDTO.setDescription(description);
            return createDisasterWarning(disasterWarningDTO);
        }

        return null; // Nếu không có cảnh báo nào được tạo
    }

    private boolean continuousHeavyRain(List<WeatherData> weatherDataList) {
        int heavyRainCount = 0;

        for (WeatherData weatherData : weatherDataList) {
            if (weatherData.getTotalprecip_mm() != null && weatherData.getTotalprecip_mm()/24 >= 50) {
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
    private int getBeaufortScale(double windSpeed) {
        if (windSpeed < 0.3) {
            return 0;  // Calm
        } else if (windSpeed < 1.6) {
            return 1;  // Light air
        } else if (windSpeed < 3.4) {
            return 2;  // Light breeze
        } else if (windSpeed < 5.5) {
            return 3;  // Gentle breeze
        } else if (windSpeed < 8.0) {
            return 4;  // Moderate breeze
        } else if (windSpeed < 10.8) {
            return 5;  // Fresh breeze
        } else if (windSpeed < 13.9) {
            return 6;  // Strong breeze
        } else if (windSpeed < 17.2) {
            return 7;  // High wind, moderate gale
        } else if (windSpeed < 20.8) {
            return 8;  // Gale
        } else if (windSpeed < 24.5) {
            return 9;  // Strong gale
        } else if (windSpeed < 28.5) {
            return 10; // Storm
        } else if (windSpeed < 32.7) {
            return 11; // Violent storm
        } else {
            return 12; // Hurricane force
        }
    }
}
