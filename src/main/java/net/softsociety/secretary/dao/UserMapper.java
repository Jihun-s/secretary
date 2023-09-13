package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.User;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    void updateUser(User user);
    User findByVerificationToken(String token);
	void enableUser(String token);
    User findByEmailOrUserId(@Param("emailOrUserId") String emailOrUserId);
	int countByEmail(String userEmail);
	int countByUserId(String userId);
	void updateUserPw(User user);
	//관리자 기능 유저목록 - 인찬
	ArrayList<User> findALL();
	//관리자 기능 유저 정보 편집
	int editUser(User updatedUser);
	//관리자 기능 유저 정보 열람
	User readUser(String userId);
}