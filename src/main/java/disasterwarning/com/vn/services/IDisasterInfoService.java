package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;

import java.util.List;

public interface IDisasterInfoService {
    DisasterInfoDTO createDisasterInfo(DisasterInfoDTO disasterInfoDTO);

    DisasterInfoDTO findDisasterInfoById(int id);

    List<DisasterInfoDTO> findAllDisasterInfos();

    DisasterInfoDTO updateDisasterInfo(int id, DisasterInfoDTO disasterInfoDTO);

    boolean deleteDisasterInfo(int id);
}
