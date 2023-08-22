package net.softsociety.secretary.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.User;

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

        // 사용자 상태 설정 (인증 대기 중)
        user.setEnabled(0);

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
            userMapper.enableUser(token);
            return true;
        }
        return false;
    }

	@Override
	public User findByEmail(String email) {
		return userMapper.findByEmail(email);
	}
}
