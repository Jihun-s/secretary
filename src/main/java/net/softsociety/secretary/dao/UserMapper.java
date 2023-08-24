package net.softsociety.secretary.dao;

import org.apache.ibatis.annotations.Mapper;
import net.softsociety.secretary.domain.User;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    void updateUser(User user);
    User findByVerificationToken(String token);
	void enableUser(String token);
	User findByEmail(String email);
	int countByEmail(String userEmail);
	int countByUserId(String userId);
	void updateUserPw(User user);
}