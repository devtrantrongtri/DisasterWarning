package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IDisasterWarningService {

    public DisasterWarningDTO createDisasterWarning(DisasterWarningDTO disasterWarningDTO);

    public DisasterWarningDTO updateDisasterWarning(int id, DisasterWarningDTO disasterWarningDTO);

    public DisasterWarningDTO findDisasterWarningById(int id);

    public Page<DisasterWarningDTO> findAllDisasterWarning(Pageable pageable);

    public boolean deleteDisasterWarning(int id);
}
