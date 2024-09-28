package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.UserDTO;
import disasterwarning.com.vn.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user-management")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/user")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO createdUser = iUserService.createUser(userDTO);
        if (createdUser != null) {
            return ResponseEntity.ok(createdUser);
        }
        return ResponseEntity.notFound().build();
    }
}
