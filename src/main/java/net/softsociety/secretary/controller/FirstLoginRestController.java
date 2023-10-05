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
    


}