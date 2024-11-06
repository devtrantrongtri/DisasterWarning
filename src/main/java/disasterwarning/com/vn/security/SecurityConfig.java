package disasterwarning.com.vn.security;

import disasterwarning.com.vn.models.entities.User;
import disasterwarning.com.vn.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.stream.Collectors;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepo userRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            User user = userRepo.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("Cannot find user with email =" + email);
            }
            return convertToUserDetails(user);
        };
    }

    private UserDetails convertToUserDetails(User user) {
        Collection<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(role -> new SimpleGrantedAuthority(role.getAuthority()))
                .collect(Collectors.toList());

        return new CustomUserDetails(user.getEmail(), user.getPassword(), authorities);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}
