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
import org.springframework.web.bind.annotation.ResponseBody;

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
	@GetMapping("signup")
	public String signup() {
		return "userView/signup";
	}
	
	//로그인
	@GetMapping("login")
	public String login() {
		return "userView/login";
	}
	
    @GetMapping("/forgot-password")
    public String showForgotPasswordPage() {
        return "userView/forgot-password-basic"; // 비밀번호 재설정 요청 페이지를 반환합니다.
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(@RequestParam String email, Model model, HttpServletRequest request) {
        if (!userService.existsByEmail(email)) { // 해당 이메일이 존재하는지 검사
            model.addAttribute("errorMessage", "해당 이메일로 등록된 계정이 없습니다.");
            return "userView/forgot-password-basic";
        }

        userService.sendPasswordResetToken(email, getSiteURL(request));
        model.addAttribute("message", "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
        return "userView/message"; // 메시지를 표시하는 뷰로 리다이렉트
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token, Model model) {
        User user = userService.findByVerificationToken(token);
        if (user == null) {
            model.addAttribute("message", "유효하지 않은 토큰입니다.");
            return "userView/message";
        }

        model.addAttribute("token", token);
        return "userView/reset-password-form"; // 실제 비밀번호 재설정 폼을 반환합니다.
    }

    @PostMapping("/reset-password")
    public String processResetPassword(@RequestParam("token") String token, @RequestParam("userPw") String newPassword, Model model) {
        User user = userService.findByVerificationToken(token);
        if (user == null) {
            model.addAttribute("message", "토큰이 만료되었습니다.");
            return "userView/message";
        }

        userService.resetPassword(user, newPassword);
        model.addAttribute("message", "비밀번호가 성공적으로 재설정되었습니다.");

        return "userView/message"; // 성공 메시지를 보여줄 템플릿을 반환합니다.
    }
	
	@PostMapping("/register")
	public String registerUser(@ModelAttribute User user, HttpServletRequest request) {
	    userService.register(user, getSiteURL(request));
	    return "redirect:/user/check-email";
	}
	
	@ResponseBody
	@PostMapping("/idcheck")
	public int checkUserId(@RequestParam String userId) {
		log.debug("아이디 왔나요?? : {}", userId);
	    if (userService.existsByUserId(userId)) {
	        return 1;  // 사용중인 ID
	    } else {
	        return 0;  // 사용 가능한 ID
	    }
	}

	@ResponseBody
	@PostMapping("/emailcheck")
	public int checkUserEmail(@RequestParam String userEmail) {
	    if (userService.existsByEmail(userEmail)) {
	        return 1;  // 사용중인 이메일
	    } else {
	        return 0;  // 사용 가능한 이메일
	    }
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

