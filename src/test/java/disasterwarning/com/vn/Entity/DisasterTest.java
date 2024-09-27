package disasterwarning.com.vn.Entity;

import disasterwarning.com.vn.models.entities.Disaster;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DisasterTest {
    @Test
    void testGetterAndSetter() {
        Disaster disaster = new Disaster("Earthquake", "url/to/image", "Severe earthquake");

        assertEquals("Earthquake", disaster.getDisasterName());
        assertEquals("url/to/image", disaster.getImageUrl());
        assertEquals("Severe earthquake", disaster.getDescription());

        disaster.setDisasterName("Flood");
        assertEquals("Flood", disaster.getDisasterName());
        disaster.setImageUrl("url/to/flood/image");
        assertEquals("url/to/flood/image", disaster.getImageUrl());
        disaster.setDescription("Heavy flood");
        assertEquals("Heavy flood", disaster.getDescription());
    }

    @Test
    void testConstructor() {
        Disaster disaster = new Disaster("Tornado", "url/to/tornado/image", "Tornado warning");
        assertNotNull(disaster);
        assertEquals("Tornado", disaster.getDisasterName());
        assertEquals("url/to/tornado/image", disaster.getImageUrl());
        assertEquals("Tornado warning", disaster.getDescription());
    }

    @Test
    void testDefaultConstructor() {
        Disaster disaster = new Disaster();
        assertNotNull(disaster);
        assertNull(disaster.getDisasterName());
        assertNull(disaster.getImageUrl());
        assertNull(disaster.getDescription());
    }
}
