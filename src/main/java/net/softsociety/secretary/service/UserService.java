package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.List;

import net.softsociety.secretary.domain.AllLog;
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
	//일별 회원가입 수 출력
	List<User> getDailyJoinData();
	//로그보드 
	List<AllLog> getLogData();
	//로그인 보드
	List<Log> getLoginData();
	//특정 회원 활동량 조회
	List<Log> getUserLoginData(String userId);
	//특정 회원 컨텐츠별 이용률
	List<AllLog> getActRateData(String userId);


	
}