package disasterwarning.com.vn.configuration;

import disasterwarning.com.vn.models.entities.User;
import disasterwarning.com.vn.repositories.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializerConfig {

    @Bean
    CommandLineRunner initDatabase (UserRepo userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepo.findByEmail("admin@gmail.com");
            if (userRepo.findByEmail("admin@gmail.com") == null) {
                User newUser = new User();
                newUser.setEmail("admin@gmail.com");
                newUser.setPassword(passwordEncoder.encode("admin"));
                newUser.setRole("admin");
                newUser.setUserName("Nguyễn Lê Hiếu Nhi");
                userRepo.save(newUser);
            }
        };
    }
}
