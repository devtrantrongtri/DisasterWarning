package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterWarningDTO;

import java.util.List;

public interface IDisasterWarningService {

    public DisasterWarningDTO createDisasterWarning(DisasterWarningDTO disasterWarningDTO);

    public DisasterWarningDTO updateDisasterWarning(int id, DisasterWarningDTO disasterWarningDTO);

    public DisasterWarningDTO findDisasterWarningById(int id);

    public List<DisasterWarningDTO> findAllDisasterWarning();

    public boolean deleteDisasterWarning(int id);
}
