package disasterwarning.com.vn.exceptions;

public class DataNotFoundException extends RuntimeException {

    public DataNotFoundException(String message) {
        super(message);
    }

    public DataNotFoundException(String dataType, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", dataType, fieldName, fieldValue));
    }
}