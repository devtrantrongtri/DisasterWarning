package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.components.JwtTokenUtils;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.GoogleTokenDTO;
import disasterwarning.com.vn.models.dtos.LoginDTO;
import disasterwarning.com.vn.models.dtos.TokenDTO;
import disasterwarning.com.vn.models.dtos.UserDTO;
import disasterwarning.com.vn.models.entities.Token;
import disasterwarning.com.vn.models.entities.User;
import disasterwarning.com.vn.services.TokenService;
import disasterwarning.com.vn.services.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-management")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/generate-secret-key")
    public ResponseEntity<String> generateSecretKey(){
        return ResponseEntity.ok(jwtTokenUtils.generateSecretKey());
    }


    @PostMapping("/register")
    public ResponseEntity<ResponseWrapper<UserDTO>> createUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO createdUser = userService.createUser(userDTO);
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User created successfully", createdUser);
            return new ResponseEntity<>(responseWrapper, HttpStatus.CREATED);
        } catch (DuplicateDataException e) {
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User already exists", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseWrapper<?>> login(@RequestBody LoginDTO loginDTO) {
        try {
            String token = userService.loginUser(loginDTO.getEmail(), loginDTO.getPassword());

            if (token == null) {
                return new ResponseEntity<>(new ResponseWrapper<>("Login failed", null), HttpStatus.UNAUTHORIZED);
            }

            User userDetail = userService.getUserDetailsFromToken(token);

            if (userDetail == null) {
                return new ResponseEntity<>(new ResponseWrapper<>("Login failed", null), HttpStatus.UNAUTHORIZED);
            }

            Token jwt = tokenService.addToken(userDetail, token);
            TokenDTO tokenDTO = new TokenDTO();
            tokenDTO.setToken(jwt.getToken());
            tokenDTO.setRefreshToken(jwt.getRefreshToken());
            tokenDTO.setExpirationDate(jwt.getExpirationDate().toString());
            tokenDTO.setRole(userDetail.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList().toString());
            tokenDTO.setTokenType(jwt.getTokenType());
            tokenDTO.setUserId(userDetail.getUserId());
            tokenDTO.setUserName(userDetail.getUserName());
            tokenDTO.setEmail(userDetail.getEmail());

            ResponseWrapper<TokenDTO> responseWrapper = new ResponseWrapper<>("Login successful", tokenDTO);
            return new ResponseEntity<>(responseWrapper, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();

            ResponseWrapper<String> responseWrapper = new ResponseWrapper<>("An error occurred during login", e.getMessage());
            return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/loginGoogle")
    public ResponseEntity<ResponseWrapper<?>> loginGoogle(@RequestBody GoogleTokenDTO googleTokenDTO) {
        try {
            String token = userService.GoogleLogin(googleTokenDTO);

            if (token == null) {
                return new ResponseEntity<>(new ResponseWrapper<>("Login failed", null), HttpStatus.UNAUTHORIZED);
            }

            User userDetail = userService.getUserDetailsFromToken(token);

            if (userDetail == null) {
                return new ResponseEntity<>(new ResponseWrapper<>("Login failed", null), HttpStatus.UNAUTHORIZED);
            }

            Token jwt = tokenService.addToken(userDetail, token);
            TokenDTO tokenDTO = new TokenDTO();
            tokenDTO.setToken(jwt.getToken());
            tokenDTO.setRefreshToken(jwt.getRefreshToken());
            tokenDTO.setRole(userDetail.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList().toString());
            tokenDTO.setTokenType(jwt.getTokenType());
            tokenDTO.setUserName(userDetail.getUserName());
            tokenDTO.setEmail(userDetail.getEmail());

            ResponseWrapper<TokenDTO> responseWrapper = new ResponseWrapper<>("Login Google successful", tokenDTO);
            return new ResponseEntity<>(responseWrapper, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();

            ResponseWrapper<String> responseWrapper = new ResponseWrapper<>("An error occurred during login", e.getMessage());
            return new ResponseEntity<>(responseWrapper, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<ResponseWrapper<UserDTO>> updateUser(@PathVariable int id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(userDTO);
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User updated successfully", updatedUser);
            return ResponseEntity.ok(responseWrapper);
        } catch (DataNotFoundException e) {
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Page<UserDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> userDTOS = userService.findAllUsers(pageable);
        ResponseWrapper<Page<UserDTO>> responseWrapper;

        if (userDTOS != null && !userDTOS.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Users retrieved successfully", userDTOS);
            return ResponseEntity.ok(responseWrapper);
        } else {
            responseWrapper = new ResponseWrapper<>("No users found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<?>> deleteUser(@PathVariable int id) {
        try {
            boolean isDeleted = userService.deleteUser(id);
            if (isDeleted) {
                return ResponseEntity.ok(new ResponseWrapper<>("User deactivated successfully", Boolean.TRUE));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseWrapper<>("User not found.", Boolean.FALSE));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseWrapper<>(e.getMessage(), Boolean.FALSE));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(e.getMessage(), Boolean.FALSE));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseWrapper<>("An error occurred: " + e.getMessage(), Boolean.FALSE));
        }
    }


    @GetMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<ResponseWrapper<UserDTO>> getUser(@PathVariable int id) {
        try {
            UserDTO userDTO = userService.findUserById(id);
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User retrieved successfully", userDTO);
            return ResponseEntity.ok(responseWrapper);
        } catch (DataNotFoundException e) {
            ResponseWrapper<UserDTO> responseWrapper = new ResponseWrapper<>("User not found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/CountToken/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<ResponseWrapper<Number>> getToken(@PathVariable int userId) {
        try {
            Number countToken = tokenService.getCountToken(userId);
            ResponseWrapper<Number> responseWrapper = new ResponseWrapper<>("Token retrieved successfully", countToken);
            return ResponseEntity.ok(responseWrapper);
        } catch (Exception e) {
            ResponseWrapper<Number> responseWrapper = new ResponseWrapper<>("Token not found", 0);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }
}
