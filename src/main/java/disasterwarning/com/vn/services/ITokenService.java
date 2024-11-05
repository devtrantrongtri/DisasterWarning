package disasterwarning.com.vn.services;

import disasterwarning.com.vn.models.entities.Token;
import disasterwarning.com.vn.models.entities.User;

import java.util.List;

public interface ITokenService {
    public Token addToken(User user, String token);

    public List<Token> getAllTokensByUser(int id);

    public void deleteToken(String token);

    public Token refreshToken(String refreshToken, User user) throws Exception;
}