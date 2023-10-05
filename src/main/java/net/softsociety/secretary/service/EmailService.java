package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import lombok.extern.slf4j.Slf4j; // SLF4J 로깅 프레임워크 import

@Service
@Slf4j // 로깅 프레임워크 어노테이션
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    // HTML 이메일을 전송하는 메서드
    public void sendHtmlMessage(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("nejo.secretary@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML 본문 설정

            emailSender.send(message);
        } catch (MessagingException e) {
            log.error("이메일 발송 중 오류 발생", e); // 예외를 로깅
        }
    }
    
    public String loadHtmlContent(String filename) {
        try {
            ClassPathResource resource = new ClassPathResource(filename);
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            log.error("이메일 전용 HTML 로딩 중 오류 발생", e);
            return "";
        }
    }
}
