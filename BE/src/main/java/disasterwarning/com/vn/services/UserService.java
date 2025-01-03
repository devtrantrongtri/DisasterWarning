package disasterwarning.com.vn.services;

import disasterwarning.com.vn.components.JwtTokenUtils;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.ChangePasswordDTO;
import disasterwarning.com.vn.models.dtos.ForgotPasswordDTO;
import disasterwarning.com.vn.models.dtos.GoogleTokenDTO;
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
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService{

    @Autowired
    private UserRepo userRepo;

    // Phương thức đếm số người dùng
    public long countUsers() {
        return userRepo.count();
    }



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

    @Autowired
    private JwtDecoder jwtDecoder;


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
        newUser.setRole("user");
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
        if(user.getLocation() != null && user.getLocation().getLocationName() != null){
            Location existingLocation = locationRepo.findByName(user.getLocation().getLocationName());
            if(existingLocation == null){
                throw new DataNotFoundException("Location does not exist");
            }
            existingUser.setLocation(existingLocation);
        }
        userRepo.save(existingUser);
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
        if ("user".equals(user.getRole())) {
            user.setStatus("inactive");
            userRepo.save(user);
        } else if ("admin".equals(user.getRole())) {
            throw new RuntimeException("Cannot delete admin user");
        } else {
            throw new RuntimeException("User is not in an inactive role");
        }
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

    @Override
    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        User user = userRepo.findByEmail(email);
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
    }

    @Override
    public void changeForgotPassword(String username, ForgotPasswordDTO forgotPasswordDTO) {
        User user = userRepo.findByEmail(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (!forgotPasswordDTO.getPassword().equals(forgotPasswordDTO.getRetypePassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(forgotPasswordDTO.getPassword()));
        userRepo.save(user);
    }

    @Override
    public String GoogleLogin(GoogleTokenDTO tokenRequest) {
        try {
            String token = tokenRequest.getToken();
            // Decode JWT token
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");
            String name = jwt.getClaim("name");

            User existingUser = userRepo.findByEmail(email);
            if (existingUser == null) {
                UserDTO userDTO = new UserDTO();
                userDTO.setEmail(email);
                userDTO.setUserName(name);
                userDTO.setPassword("GOOGLE_USER");
                userDTO.setRole("user");

                UserDTO newUser = createUser(userDTO);
                return loginUser(newUser.getEmail(), "GOOGLE_USER");
            }
            return loginUser(existingUser.getEmail(), "GOOGLE_USER");
        } catch (Exception e) {
            System.err.println("Lỗi khi đăng nhập bằng Google: " + e.getMessage());
            throw new RuntimeException("Đã xảy ra lỗi trong quá trình đăng nhập bằng Google", e);
        }
    }
}
