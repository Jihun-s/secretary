package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.CustomUserDetails;
import net.softsociety.secretary.service.UserService;

@Slf4j
@Controller
public class HomeController {
	
	@Autowired
    private UserService userService;  
	/**
	 * 메인화면!
	 */
	@GetMapping({"", "/"})
    public String home() {
		log.debug("홈페이지 로그");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Check if the principal is a CustomUserDetails
            if (authentication.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

                if ("ROLE_ADMIN".equals(userDetails.getUser().getRolename())) {
                    // Redirect to the admin page
                    return "redirect:/adminView/adminHome";
                }
            }
        }
		return "homeView/home";
	}
	
}
