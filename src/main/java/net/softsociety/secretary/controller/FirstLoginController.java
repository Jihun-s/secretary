package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import lombok.extern.slf4j.Slf4j;

/** 
 * 첫 로그인 컨트롤러
 * */

@Slf4j
@Controller
public class FirstLoginController {

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
}
