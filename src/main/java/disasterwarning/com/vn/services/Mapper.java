package disasterwarning.com.vn.services;

import org.modelmapper.MappingException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Mapper {

    @Autowired
    private ModelMapper modelMapper;

    public <D, E> E convertToEntity(D dto, Class<E> entityClass) {
        try {
            if (dto == null) {
                return null;
            }
            return modelMapper.map(dto, entityClass);
        } catch (MappingException e) {
            throw new IllegalArgumentException("Error mapping DTO to entity", e);
        }
    }

    public <E, D> D convertToDto(E entity, Class<D> dtoClass) {
        try {
            if (entity == null) {
                return null;
            }
            return modelMapper.map(entity, dtoClass);
        } catch (MappingException e) {
            throw new IllegalArgumentException("Error mapping entity to DTO", e);
        }
    }


    public <D, E> List<E> convertToEntityList(List<D> dtoList, Class<E> entityClass) {
        return dtoList.stream()
                .map(dto -> convertToEntity(dto, entityClass))
                .collect(Collectors.toList());
    }

    public <E, D> List<D> convertToDtoList(List<E> entityList, Class<D> dtoClass) {
        return entityList.stream()
                .map(entity -> convertToDto(entity, dtoClass))
                .collect(Collectors.toList());
    }
}
