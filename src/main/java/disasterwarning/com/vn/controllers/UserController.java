package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.Response.ResponseWrapper;
import disasterwarning.com.vn.components.JwtTokenUtils;
import disasterwarning.com.vn.exceptions.DataNotFoundException;
import disasterwarning.com.vn.exceptions.DuplicateDataException;
import disasterwarning.com.vn.models.dtos.UserDTO;
import disasterwarning.com.vn.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-management")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

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
    public ResponseEntity<ResponseWrapper<List<UserDTO>>> getAllUsers() {
        List<UserDTO> userDTOS = userService.findAllUsers();
        ResponseWrapper<List<UserDTO>> responseWrapper;

        if (userDTOS != null && !userDTOS.isEmpty()) {
            responseWrapper = new ResponseWrapper<>("Users retrieved successfully", userDTOS);
            return ResponseEntity.ok(responseWrapper);
        } else {
            responseWrapper = new ResponseWrapper<>("No users found", null);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
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

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Boolean>> deleteUser(@PathVariable int id) {
        try {
            boolean deleted = userService.deleteUser(id);
            ResponseWrapper<Boolean> responseWrapper = new ResponseWrapper<>("User deleted successfully", deleted);
            return ResponseEntity.noContent().build();
        } catch (DataNotFoundException e) {
            ResponseWrapper<Boolean> responseWrapper = new ResponseWrapper<>("User not found", false);
            return new ResponseEntity<>(responseWrapper, HttpStatus.NOT_FOUND);
        }
    }
}
