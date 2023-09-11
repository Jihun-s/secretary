package net.softsociety.secretary.controller;


import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.UserService;
@Slf4j
@Controller
@RequestMapping("admin")
public class AdminController {
	@Autowired
	UserService userservice;
	@Autowired
	UserMapper usermapper;
	@GetMapping("list")
	public String list() {
		return "adminView/userList";
	}
	@ResponseBody
	@GetMapping("userList")
	public ArrayList<User> userList() {
		ArrayList<User> userList =userservice.findALL();
		
		return  userList;
	}
}
