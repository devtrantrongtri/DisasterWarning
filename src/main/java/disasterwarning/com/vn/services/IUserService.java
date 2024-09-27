package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.dtos.UserDTO;

import java.util.List;

//thêm xử lý lỗi/ngoại lệ
public interface IUserService {

    public UserDTO createUser(UserDTO userDTO);

    public UserDTO updateUser(UserDTO userDTO);

    public UserDTO findUserById(int id);

    public UserDTO findUserByEmail(String email);

    public List<UserDTO> findAllUsers();

    public boolean deleteUser(int id);

}
