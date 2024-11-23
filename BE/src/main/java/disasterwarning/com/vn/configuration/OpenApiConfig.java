package disasterwarning.com.vn.configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(name = "trantrongtri", email = "contact@trantrongtri.com", url = "https://trantrongtri.com/course"),
                description = "OpenApi documentation for Spring Security",
                title = "OpenApi specification - trantrongtri",
                version = "1.0",
                license = @License(name = "Licence name", url = "https://some-url.com"),
                termsOfService = "Terms of service"
        ),
        servers = {
                @Server(description = "Local ENV", url = "https://localhost:8080"),
                @Server(description = "PROD ENV", url = "https://trantrongtri.com")
        },
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(name = "bearerAuth", description = "JWT auth description", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
@Configuration
public class OpenApiConfig {
}
