package net.softsociety.secretary.controller;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Log;
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
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@GetMapping("adminHome")
	public String adminHome() {
		return "adminView/adminHome";
	}
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
	//회원정보 열람
	@GetMapping("readUser")
	public String readUser(String userId, Model m) {
		log.debug("userId:  {}" , userId);
		User u = userservice.findByEmailOrUserId(userId);
		m.addAttribute("user", u);
		return "adminView/readUser";
	}
	//수정 요청
	@GetMapping("editUser")
	public String editUser(String userId, Model m) {
		log.debug("userId:  {}" , userId);
		User u = userservice.findByEmailOrUserId(userId);
		
		m.addAttribute("u", u);
		return "adminView/editUser";
	}
	//회원정보 수정
	@PostMapping("editUser")
	public String editUser(@ModelAttribute User updatedUser) {
		int enabled;
		if(updatedUser.isEnabled()==true) {
			enabled = 1;
		}else enabled =0;
		userservice.editUser(updatedUser);
		
		return "redirect:/admin/list";
	}
	//일일 로그인 수 그래프
	@GetMapping("dailyLogin")
	@ResponseBody
	public ResponseEntity<List<Log>> dailyLogin() {
	    List<Log> result = userservice.getDailyLoginData();
	    
	    return ResponseEntity.ok(result);
	}


	
}
