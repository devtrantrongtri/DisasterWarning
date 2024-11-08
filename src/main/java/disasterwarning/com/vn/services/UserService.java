package disasterwarning.com.vn.services;

import disasterwarning.com.vn.components.JwtTokenUtils;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.ChangePasswordDTO;
import disasterwarning.com.vn.models.dtos.ForgotPasswordDTO;
import disasterwarning.com.vn.models.dtos.UserDTO;
import disasterwarning.com.vn.models.entities.Location;
import disasterwarning.com.vn.models.entities.User;
import disasterwarning.com.vn.repositories.LocationRepo;
import disasterwarning.com.vn.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService{

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private Mapper mapper;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserDTO createUser(UserDTO userDTO) throws DuplicateDataException {
        User newUser = mapper.convertToEntity(userDTO, User.class);
        User existingUser = userRepo.findByEmail(newUser.getEmail());
        if (existingUser != null) {
            throw new DuplicateDataException("User already exists");
        }
        if(userDTO.getLocation() != null){
            Location location = locationRepo.findById(newUser.getLocation().getLocationId())
                    .orElseThrow(()->new DataNotFoundException("Location not found"));
            newUser.setLocation(location);
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setStatus("active");
        newUser.setRole("ROLE_USER");
        userRepo.save(newUser);
        return mapper.convertToDto(newUser, UserDTO.class);
    }


    public UserDTO updateUser(UserDTO userDTO) {
        User user = mapper.convertToEntity(userDTO, User.class);
        User existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser == null) {
            throw new DataNotFoundException("User does not exist");
        }
        existingUser.setUserName(user.getUserName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        if(user.getLocation() != null && user.getLocation().getLocationId() != 0){
            Location existingLocation = locationRepo.findById(user.getLocation().getLocationId())
                    .orElseThrow(()->new DataNotFoundException("Location not found"));
            existingUser.setLocation(existingLocation);
        }
        userRepo.save(user);
        return mapper.convertToDto(user, UserDTO.class);
    }

    public UserDTO findUserById(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User does not exist"));
        return mapper.convertToDto(user, UserDTO.class);
    }

    public UserDTO findUserByEmail(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new DataNotFoundException("User does not exist");
        }
        return mapper.convertToDto(user, UserDTO.class);
    }

    public Page<UserDTO> findAllUsers(Pageable pageable) {
        Page<User> users = userRepo.findAll(pageable);
        if (users.isEmpty()) {
            throw new DataNotFoundException("User does not exist");
        }
        return mapper.convertToDtoPage(users, UserDTO.class);
    }

    public boolean deleteUser(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User does not exist"));
        user.setStatus("inactive");
        userRepo.save(user);
        return true;
    }

    @Override
    public List<UserDTO> findUsersByProvince(String province) throws DataNotFoundException {
        List<User> users = userRepo.findUsersByProvince(province);
        if (users.isEmpty()) {
            throw new DataNotFoundException("User does not exist");
        }
        return mapper.convertToDtoList(users, UserDTO.class);
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if (jwtTokenUtils.isTokenExpired(token)) {
            throw new RuntimeException("Token is expired");
        }
        String email = jwtTokenUtils.extractEmail(token);
        User user = userRepo.findByEmail(email);
        if (user != null) {
            return user;
        } else {
            throw new Exception("User not found");
        }
    }

    @Override
    public String loginUser(String email, String password) throws DataNotFoundException {
        User existingUser = userRepo.findByEmail(email);
        if (existingUser == null) {
            throw new DataNotFoundException("Invalid email/password");
        }
        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new DataNotFoundException("Invalid email/password");
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, password,
                existingUser.getAuthorities()
        );
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtils.generateToken(existingUser);
    }

    public boolean changePassword(String username, ChangePasswordDTO changePasswordDTO) {
        User user = userRepo.findByEmail(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        if (!changePasswordDTO.getPassword().equals(changePasswordDTO.getRetypePassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getPassword()));
        userRepo.save(user);
        return true;
    }

    public boolean changeForgotPassword(String username, ForgotPasswordDTO forgotPasswordDTO) {
        User user = userRepo.findByEmail(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (!forgotPasswordDTO.getPassword().equals(forgotPasswordDTO.getRetypePassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(forgotPasswordDTO.getPassword()));
        userRepo.save(user);
        return true;
    }
}
