package disasterwarning.com.vn.models.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class WeatherData {
    private long dt; // Thời gian dự báo (timestamp)
    private Main main; // Thông tin chính về nhiệt độ, áp suất, độ ẩm
    private List<Weather> weather; // Danh sách các điều kiện thời tiết
    private Clouds clouds; // Thông tin về mây
    private Wind wind; // Thông tin về gió
    private int visibility; // Tầm nhìn
    private double pop; // Xác suất mưa
    private Rain rain; // Thông tin về mưa
    private Sys sys; // Thông tin hệ thống (pod)
    private String dt_txt; // Thời gian dự báo dạng chuỗi
    private String cityName;

    @Data
    public static class Main {
        private double temp;
        private double feels_like;
        private double temp_min;
        private double temp_max;
        private int pressure;
        private int sea_level;
        private int grnd_level;
        private int humidity;
        private double temp_kf;
    }

    @Data
    public static class Weather {
        private int id;
        private String main;
        private String description;
        private String icon;
    }

    @Data
    public static class Clouds {
        private int all;
    }

    @Data
    public static class Wind {
        private double speed;
        private int deg;
        private double gust;
    }

    @Data
    public static class Rain {
        @JsonProperty("3h")
        private double _3h;
    }

    @Data
    public static class Sys {
        private String pod;
    }

}
