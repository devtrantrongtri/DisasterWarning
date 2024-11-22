package disasterwarning.com.vn.Entity;

import disasterwarning.com.vn.models.entities.Disaster;
import disasterwarning.com.vn.models.entities.DisasterWarning;
import disasterwarning.com.vn.models.entities.Location;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class DisasterWarningTest {

    @Test
    void testGetterAndSetter() {
        // Khởi tạo đối tượng Location hợp lệ
        Location location = new Location("Hanoi", new BigDecimal("21.0285"), new BigDecimal("105.8542"));

        // Khởi tạo đối tượng Disaster hợp lệ
        Disaster disaster = new Disaster(1, "Flood", "url/to/image", "Flood warning", null, null);  // Không truyền 0 mà là giá trị hợp lệ

        // Khởi tạo đối tượng DisasterWarning với Disaster và Location hợp lệ
        DisasterWarning warning = new DisasterWarning(disaster, location, Date.valueOf("2024-09-28"), "Flood expected", "ACTIVE");

        // Kiểm tra các giá trị
        assertEquals(disaster, warning.getDisaster());
        assertEquals(location, warning.getLocation());
        assertEquals(Date.valueOf("2024-09-28"), warning.getStartDate());
        assertEquals("Flood expected", warning.getDescription());
        assertEquals("ACTIVE", warning.getStatus());  // Kiểm tra trạng thái
    }

    @Test
    void testConstructor() {
        // Khởi tạo đối tượng Location và Disaster hợp lệ
        Location location = new Location("Earthquake Zone", new BigDecimal("15.0"), new BigDecimal("100.0"));
        Disaster disaster = new Disaster(2, "Earthquake", "url/to/image", "Severe earthquake", null, null);  // Không truyền 0 mà là giá trị hợp lệ

        // Khởi tạo đối tượng DisasterWarning với Disaster và Location hợp lệ
        DisasterWarning warning = new DisasterWarning(disaster, location, Date.valueOf("2024-09-28"), "Severe earthquake warning", "ACTIVE");

        // Kiểm tra các giá trị
        assertNotNull(warning);
        assertEquals("Severe earthquake warning", warning.getDescription());
        assertEquals("ACTIVE", warning.getStatus());
    }

    @Test
    void testDefaultConstructor() {
        // Khởi tạo đối tượng DisasterWarning không có tham số
        DisasterWarning warning = new DisasterWarning();

        // Kiểm tra đối tượng đã được khởi tạo đúng chưa
        assertNotNull(warning);
        assertNull(warning.getDisaster());
        assertNull(warning.getLocation());
        assertNull(warning.getStartDate());
        assertNull(warning.getDescription());
        assertNull(warning.getStatus());  // Trạng thái cũng phải là null nếu chưa được khởi tạo
    }
}
