package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.service.EmailService;

@Slf4j
@RestController // RESTful 웹 서비스의 컨트롤러로 등록
public class FirstLoginRestController {
	
    @Autowired // EmailService 의존성 자동 주입
    private EmailService emailService;
    

    // 이메일 전송 API (POST 요청 처리)
    @PostMapping("/sendEmail")
    public String sendEmail(@RequestParam("email") String email) {
    	log.debug("이메일 전송하기" + email);
        String registrationLink = "http://localhost:8888/secretary/user/signup"; // 회원가입 링크
        // 이메일 서비스를 이용해서 이메일을 전송
        emailService.sendSimpleMessage(email, "회원가입을 위한 링크입니다", "회원가입을 완료하려면 다음 링크를 클릭하세요: " + registrationLink);
        return "Email sent"; // 이메일 전송 성공 메시지 반환
    }
}