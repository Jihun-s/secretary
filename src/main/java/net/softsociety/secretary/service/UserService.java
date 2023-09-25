package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.List;

import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.domain.User;

public interface UserService {
	void register(User user, String siteURL);
	
	boolean verify(String token);

	User findByEmailOrUserId(String emailOrUserId);

	boolean existsByEmail(String userEmail);

	boolean existsByUserId(String userId);
	
    void sendPasswordResetToken(String userEmail, String siteURL);
    
    User findByVerificationToken(String token);
    
    void resetPassword(User user, String newPassword);
    
    //관리자 기능 유저목록
	ArrayList<User> findALL();
	//관리자 기능 유저정보 편집
	int editUser(User updatedUser);
	//일별 로그인수 출력
	List<Log> getDailyLoginData();
	//시간별 로그인 수 출력
	List<Log> getHourlyLoginData();


	
}