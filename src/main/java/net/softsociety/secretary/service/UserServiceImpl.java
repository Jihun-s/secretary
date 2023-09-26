package net.softsociety.secretary.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.domain.User;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper; // 변경된 부분: UserMapper 사용

    @Autowired
    private JavaMailSender javaMailSender;
    
	@Autowired
	private PasswordEncoder passwordEncoder;

    public void register(User user, String siteURL) {
    	
    	// 사용자로부터 받은 평문 비밀번호를 인코딩
        String encodedPassword = passwordEncoder.encode(user.getUserPw());
        
        // 인코딩된 비밀번호를 사용자 객체에 설정
        user.setUserPw(encodedPassword);
    	
        // 인증 토큰 생성
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        // 토큰 유효기간 설정 (예: 24시간)
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        user.setVerificationTokenExpiryDate(expiryDate);

        // 사용자 상태 설정 (인증 대기 중)
        user.setEnabled(false);

        // MyBatis를 사용하여 사용자 삽입
        userMapper.insertUser(user); // 변경된 부분

        // 이메일 메시지 생성
        String subject = "회원가입 인증";
        String recipient = user.getUserEmail();
        String confirmationUrl = siteURL + "/user/confirm?token=" + token;
        String message = "가입 인증을 위해 다음 링크를 클릭해 주세요: " + confirmationUrl;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setTo(recipient);
        email.setText(message);

        // 이메일 전송
        javaMailSender.send(email);
    }

    @Override
    public boolean verify(String token) {
        User user = userMapper.findByVerificationToken(token);
        if (user != null) {
            // 토큰 유효기간 확인
            if (LocalDateTime.now().isBefore(user.getVerificationTokenExpiryDate())) {
                userMapper.enableUser(token);
                return true;
            }
        }
        return false;
    }

	@Override
	public User findByEmailOrUserId(String emailOrUserId) {
		return userMapper.findByEmailOrUserId(emailOrUserId);
	}
	
	//이메일 조회
	@Override
	public boolean existsByEmail(String userEmail) {
		return userMapper.countByEmail(userEmail) > 0;
	}

	//아이디 조회
	@Override
	public boolean existsByUserId(String userId) {
		return userMapper.countByUserId(userId) > 0;
	}
    
    @Override
    public void sendPasswordResetToken(String userEmail, String siteURL) {
        User user = userMapper.findByEmailOrUserId(userEmail);

        if (user != null) {
            // 토큰 생성
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);

            // 토큰 유효기간 설정 (예: 24시간)
            LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
            user.setVerificationTokenExpiryDate(expiryDate);

            // MyBatis를 사용하여 사용자 업데이트
            userMapper.updateUser(user);

            // 이메일 메시지 생성
            String subject = "Password Reset Request";
            String resetUrl = siteURL + "/user/reset-password?token=" + token;
            String message = "To reset your password, click the link below:\n" + resetUrl;

            SimpleMailMessage email = new SimpleMailMessage();
            email.setSubject(subject);
            email.setTo(userEmail);
            email.setText(message);

            // 이메일 전송
            javaMailSender.send(email);
        }
    }
    
    @Override
    public User findByVerificationToken(String token) {
        return userMapper.findByVerificationToken(token);
    }

    @Override
    public void resetPassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setUserPw(encodedPassword);
        userMapper.updateUserPw(user);
    }
    //관리자 기능 유저목록 조회-인찬
	@Override
	public ArrayList<User> findALL() {
		ArrayList<User> findeALL = userMapper.findALL();
		return findeALL;
	}
	//관리자 기능 유저 정보 편집
	@Override
	public int editUser(User updatedUser) {
		int n= userMapper.editUser(updatedUser);
		return n;
	}
	//관리자 기능 일별 로그인 횟수 
	@Override
	public List<Log> getDailyLoginData() {
		return userMapper.getDailyLoginData();
	}
	//관리자 기능 시간별 로그인 횟수
	@Override
	public List<Log> getHourlyLoginData() {
		
		return userMapper.getHourlyLoginData();
	}
	//일별 회원가입 수 그래프
	@Override
	public List<User> getDailyJoinData() {
		
		return userMapper.getDailyJoinData();
	}

	

}
