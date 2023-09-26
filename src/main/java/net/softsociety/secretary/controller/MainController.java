package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.User;

@Slf4j
@Controller
@RequestMapping("main")
public class MainController {

	/**
	 * 메인화면!
	 */
	@GetMapping({"", "/"})
	public String main(Model model) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		log.debug("로그인한 녀석의 familyId:{}", familyId);
		
		if(familyId == 0) {
			return "firstLoginView/firstLogin";
		}
		
		return "mainView/index";
	}

}
