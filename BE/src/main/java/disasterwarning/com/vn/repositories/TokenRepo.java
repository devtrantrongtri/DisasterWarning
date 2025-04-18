package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepo extends JpaRepository<Token, Integer> {

    @Query("SELECT t FROM Token t WHERE t.user.userId=:id")
    List<Token> findByUser(int id);

    Token findByToken(String token);

    Token findByRefreshToken(String refreshToken);
}
