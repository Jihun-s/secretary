package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.UserService;

@Controller
@RequestMapping("admin")
public class AdminController {
	@Autowired
	UserService userservice;
	public String userList(Model m) {
		List<User> userList =userservice.findALL();
		m.addAttribute("userList", userList);
		return "userList";
	}
}
