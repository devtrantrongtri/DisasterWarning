package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IDisasterService {

    public DisasterDTO createDisaster(DisasterDTO disasterDTO, MultipartFile image)  throws IOException;

    public DisasterDTO updateDisaster(int id,DisasterDTO disasterDTO, MultipartFile image)  throws IOException;

    public DisasterDTO findDisasterById(int id);

    public DisasterDTO findDisasterByName(String disasterName);

    public Page<DisasterDTO> findAllDisaster(Pageable pageable);

    public boolean deleteDisaster(int id);
}
