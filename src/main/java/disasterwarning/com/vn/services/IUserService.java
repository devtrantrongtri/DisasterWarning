package disasterwarning.com.vn.services;

import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.UserDTO;
import disasterwarning.com.vn.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService {

    public UserDTO createUser(UserDTO userDTO) throws DuplicateDataException;

    public UserDTO updateUser(UserDTO userDTO) throws DataNotFoundException;

    public UserDTO findUserById(int id) throws DataNotFoundException;

    public UserDTO findUserByEmail(String email) throws DataNotFoundException;

    public Page<UserDTO> findAllUsers(Pageable pageable) throws DataNotFoundException;

    public boolean deleteUser(int id) throws DataNotFoundException;

    public List<UserDTO> findUsersByProvince(String province) throws DataNotFoundException;

    public User getUserDetailsFromToken(String token) throws Exception;

    public String loginUser(String email, String password) throws DataNotFoundException;
}
