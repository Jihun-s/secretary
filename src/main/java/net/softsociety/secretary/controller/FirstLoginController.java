package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.service.EmailService;

/** 
 * 첫 로그인 컨트롤러
 * */

@Slf4j
@Controller
public class FirstLoginController {
	
    @Autowired // EmailService 의존성 자동 주입
    private EmailService emailService;
    

	/** 첫 로그인 분기 페이지 출력 */
	@GetMapping("firstLogin")
	public String firstLogin() {
		
		return "firstLoginView/firstLogin";
	}

	/** 가장에게 초대 요청 보내기 */
	@PostMapping("requireInvi")
	public String requireInvi(String userId) {
		log.debug("넘어온 가장 아이디:" + userId);
		
		return "firstLoginView/requireSent";
	}

	/** 가족 구성원 초대 메일 보내기 */
	@GetMapping("inviteFamily")
	public String inviteFamily() {
		
		return "firstLoginView/inviteForm";
	}
	
	// 이메일 전송 API (POST 요청 처리)
	@PostMapping("/sendEmail")
	public String sendEmail(@RequestParam("email") String email) {
	    log.debug("이메일 전송하기" + email);
	    String registrationLink = "http://localhost:8888/secretary/user/signup"; // 회원가입 링크
	    
	    // HTML 파일의 내용을 불러와서 메세지로 설정
	    String htmlContent = emailService.loadHtmlContent("templates/emailView/invitationMail.html");
	    
	    // HTML 템플릿에 동적 내용을 삽입 (예: 회원가입 링크)
	    // 이 예제에서는 {registrationLink} 플레이스홀더를 사용하며, 실제 HTML 파일에 맞게 조절해야 함
	    htmlContent = htmlContent.replace("{registrationLink}", registrationLink); 
	    
	    try {
	        // 이메일 서비스를 이용해서 이메일을 전송
	        emailService.sendHtmlMessage(email, "[초대장] 생활비서 생비와 편리한 일상을 함께하세요.", htmlContent);
	    } catch (Exception e) {
	        log.error("이메일 전송 에러", e);
	        // 이메일 전송 실패에 대한 처리를 여기에 추가합니다
	        // 예를 들어, 사용자에게 에러 페이지를 보여줄 수 있습니다
	        return "errorView";
	    }
	    return "userView/inviSent"; // 이메일 전송 성공 메시지 반환
	}

}
