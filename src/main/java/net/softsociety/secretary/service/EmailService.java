package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired; // Spring Framework에서 의존성 주입을 위한 어노테이션
import org.springframework.mail.javamail.JavaMailSender; // 이메일을 전송하기 위한 인터페이스
import org.springframework.mail.javamail.MimeMessageHelper; // MIME 메시지를 구성하기 위한 헬퍼 클래스
import org.springframework.stereotype.Service; // 이 클래스가 서비스 레이어의 컴포넌트임을 나타내는 어노테이션

import javax.mail.MessagingException; // 메시지 생성 시 발생 가능한 예외
import javax.mail.internet.MimeMessage; // MIME 형식의 이메일 메시지를 나타내는 클래스

@Service // 서비스 클래스로 등록
public class EmailService {

    @Autowired // JavaMailSender 의존성 자동 주입
    private JavaMailSender emailSender;

    // 이메일을 전송하는 메서드
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            MimeMessage message = emailSender.createMimeMessage(); // 빈 MIME 메시지 생성
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // 메시지 헬퍼 인스턴스 생성

            helper.setFrom("your-email@gmail.com"); // 보내는 사람 설정
            helper.setTo(to); // 받는 사람 설정
            helper.setSubject(subject); // 제목 설정
            helper.setText(text, true); // 본문 설정. true는 HTML 형식임을 의미

            emailSender.send(message); // 이메일 전송
        } catch (MessagingException e) {
            e.printStackTrace(); // 예외 발생 시 스택 트레이스 출력
        }
    }
}
