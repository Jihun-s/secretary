package net.softsociety.secretary.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.UserService;

@ControllerAdvice
public class UserControllerAdvice {
	
	@Autowired
	private UserService userService;

	@ModelAttribute("loginUser")
	public User currentUser(Principal principal) {
		if (principal != null) {
			return userService.findByEmailOrUserId(principal.getName());
		}
		return null;
	}
	
}