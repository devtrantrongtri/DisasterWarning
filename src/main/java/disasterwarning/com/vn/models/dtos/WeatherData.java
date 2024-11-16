package disasterwarning.com.vn.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherData {
    private Date date;
    private BigDecimal lat;
    private BigDecimal lon;
    private Double maxwind_kph;
    private Double totalprecip_mm;
    private Double maxtemp_c;
    private Double mintemp_c;
    private Double pressure_mb;
    private Double avghumidity;
    private Double cloudCoverage;
}
