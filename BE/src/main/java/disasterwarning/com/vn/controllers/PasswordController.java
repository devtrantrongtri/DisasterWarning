package disasterwarning.com.vn.controllers;

import disasterwarning.com.vn.models.dtos.ChangePasswordDTO;
import disasterwarning.com.vn.models.dtos.ForgotPasswordDTO;
import disasterwarning.com.vn.security.CustomUserDetails;
import disasterwarning.com.vn.services.IUserService;
import disasterwarning.com.vn.services.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Objects;

@RestController
@RequestMapping("/forgot-password")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordService forgotPasswordService;


    private final IUserService userService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            forgotPasswordService.verifyEmailAndSendOTP(email);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam Integer otp) {
        try {
            forgotPasswordService.verifyOTP(email, otp);
            return ResponseEntity.ok("OTP verified successfully");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify OTP");
        }
    }

    @PostMapping("/change_password")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> changePasswordHandler(@RequestBody ChangePasswordDTO changePasswordDTO, Authentication authentication) {
        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            if (!Objects.equals(changePasswordDTO.getPassword(), changePasswordDTO.getRetypePassword())) {
                return ResponseEntity
                        .status(HttpStatus.EXPECTATION_FAILED)
                        .body(Collections.singletonMap("message", "Please enter the same password in both fields!"));
            }

            userService.changePassword(customUserDetails.getUsername(), changePasswordDTO);

            return ResponseEntity.ok(Collections.singletonMap("message", "Password has been changed!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "An error occurred while changing the password"));
        }
    }


    @PostMapping("/forgot_password/{email}")
    public ResponseEntity<String> changePasswordWhenForgot(@RequestBody ForgotPasswordDTO forgotPasswordDTO,
                                                           @PathVariable String email) {
        try {
            if (!Objects.equals(forgotPasswordDTO.getPassword(), forgotPasswordDTO.getRetypePassword())) {
                return new ResponseEntity<>("Please enter the same password in both fields!", HttpStatus.EXPECTATION_FAILED);
            }

            userService.changeForgotPassword(email, forgotPasswordDTO);
            return ResponseEntity.ok("Password has been changed!");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while changing the password", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
