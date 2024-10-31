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
        Location location = new Location("Hanoi", new BigDecimal("21.0285"), new BigDecimal("105.8542"));
        Disaster disaster = new Disaster(0, "Flood", "url/to/image", "Flood warning", null, null);
        DisasterWarning warning = new DisasterWarning(0, disaster, location, Date.valueOf("2024-09-28"), "Flood expected");

        assertEquals(disaster, warning.getDisaster());
        assertEquals(location, warning.getLocation());
        assertEquals(Date.valueOf("2024-09-28"), warning.getStartDate());
        assertEquals("Flood expected", warning.getDescription());

        warning.setDescription("Heavy flood expected");
        assertEquals("Heavy flood expected", warning.getDescription());
    }

    @Test
    void testConstructor() {
        Location location = new Location("Earthquake Zone", new BigDecimal("15.0"), new BigDecimal("100.0"));
        Disaster disaster = new Disaster(0, "Earthquake", "url/to/image", "Severe earthquake", null, null);
        DisasterWarning warning = new DisasterWarning(0, disaster, location, Date.valueOf("2024-09-28"),"Severe earthquake warning");

        assertNotNull(warning);
        assertEquals("Severe earthquake warning", warning.getDescription());
    }

    @Test
    void testDefaultConstructor() {
        DisasterWarning warning = new DisasterWarning();
        assertNotNull(warning);
        assertNull(warning.getDisaster());
        assertNull(warning.getLocation());
        assertNull(warning.getStartDate());
        assertNull(warning.getDescription());
    }
}
