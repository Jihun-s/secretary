package net.softsociety.secretary.controller;


import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.UserService;

@Slf4j
@Controller
@RequestMapping("/user")
public class UserController {
	
    @Autowired
    private UserService userService;
	
	//회원가입
	@GetMapping("signin")
	public String signin() {
		return "userView/signin";
	}
	
	//로그인
	@GetMapping("login")
	public String login() {
		return "userView/login";
	}

	@PostMapping("/register")
	public String registerUser(@ModelAttribute User user, HttpServletRequest request) {
	    userService.register(user, getSiteURL(request));
	    return "redirect:/user/check-email";
	}

    @GetMapping("/verify")
    public String verifyUser(@RequestParam("token") String token) {
        if (userService.verify(token)) {
            return "redirect:/user/verified";
        } else {
            return "redirect:/user/failed-verification";
        }
    }

    @GetMapping("/check-email")
    public String showCheckEmailPage() {
        return "userView/check-email";
    }

    @GetMapping("/verified")
    public String showVerifiedPage() {
        return "userView/verified";
    }

    @GetMapping("/failed-verification")
    public String showFailedVerificationPage() {
        return "userView/failed-verification";
    }

    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }
    
    @GetMapping("/confirm")
    public String confirmUserAccount(@RequestParam("token") String token, Model model) {
        if (userService.verify(token)) {
            return "userView/verified";
        } else {
            return "userView/failed-verification";
        }
    }
}

