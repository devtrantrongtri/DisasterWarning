package disasterwarning.com.vn.repositories;

import disasterwarning.com.vn.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    @Query("select u from User u where u.email=:email")
    User findByEmail(@Param("email") String email);

    @Query("select u from User u where u.role=:role")
    List<User> findByRole(@Param("role") String role);

}
