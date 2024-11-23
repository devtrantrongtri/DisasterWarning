package disasterwarning.com.vn.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseWrapper<T> {
    private String message;
    private T data;


    public ResponseWrapper(String message, T data) {
        this.message = message;
        this.data = data;
    }

}

