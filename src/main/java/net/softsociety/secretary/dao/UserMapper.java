package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.AllLog;
import net.softsociety.secretary.domain.Log;
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
	
	//관리자 기능 유저목록
	ArrayList<User> findALL();
	//관리자 기능 유저 정보 편집
	int editUser(User updatedUser);
	//관리자 기능 유저 정보 열람
	User readUser(String userId);
	//관리자 기능 일일 로그인 정보 
	List<Log> getDailyLoginData();
	//관리자 기능 시간별 로그인 정보
	List<Log> getHourlyLoginData();
	//관리자 기능 일일 회원가입 정보
	List<User> getDailyJoinData();
	//관리자기능 로그보드
	List<AllLog> getLogData();
	//관리자 기능 로그인보드
	List<Log> getLoginData();
	//관리자기능 특정유저 활동량 조회
	List<Log> getUserLoginData(String userId);
	//관리자기능 특정유저 컨텐츠별 이용률 
	List<AllLog> getActRateData(String userId);
	
}