package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.DisasterInfoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IDisasterInfoService {
    DisasterInfoDTO createDisasterInfo(DisasterInfoDTO disasterInfoDTO,List<MultipartFile> images);

    DisasterInfoDTO findDisasterInfoById(int id);

    List<DisasterInfoDTO> findAllDisasterInfos();

    DisasterInfoDTO updateDisasterInfo(int id, DisasterInfoDTO disasterInfoDTO,List<MultipartFile> imageFiles);

    boolean deleteDisasterInfo(int id);

    List<DisasterInfoDTO> findAllDisasterInfosByName(int id);
}
