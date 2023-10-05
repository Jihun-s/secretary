package net.softsociety.secretary.controller;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.grpc.xds.shaded.io.envoyproxy.envoy.config.rbac.v2.Principal;
import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.AllLog;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.BoardService;
import net.softsociety.secretary.service.UserService;
@Slf4j
@Controller
@RequestMapping("admin")
public class AdminController {
	@Autowired
	UserService userservice;
	@Autowired
	BoardService boardservice;
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
	    log.debug("userId:  {}", userId);
	    User u = userservice.findByEmailOrUserId(userId);
	    m.addAttribute("user", u);

	    // 시간별 활동량 데이터 가져오기
	    List<Log> userLoginData = userservice.getUserLoginData(userId);
	    m.addAttribute("userLoginData", userLoginData);
	    
	    // 컨텐츠별 이용률
	    List<AllLog> userLogData = userservice.getActRateData(userId);
	    m.addAttribute("userLogData", userLogData);

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
	//일별 로그인 수 그래프
	@GetMapping("dailyLogin")
	@ResponseBody
	public ResponseEntity<List<Log>> dailyLogin() {
	    List<Log> result = userservice.getDailyLoginData();
	    
	    return ResponseEntity.ok(result);
	}
	//시간별 접속자 그래프
	@GetMapping("hourlyLogin")
	@ResponseBody
	public ResponseEntity<List<Log>> hourlyLogin() {
		List<Log> result = userservice.getHourlyLoginData();
		return ResponseEntity.ok(result);
	}
	//게시물 수 체크
	@GetMapping("boardCount")
	@ResponseBody
	public ResponseEntity<List<Board>> boardCount() {
		
		List<Board> result = boardservice.getBoardData();
		
		return ResponseEntity.ok(result);
	}
	//답변률
	@GetMapping("responseRate")
	@ResponseBody
	public ResponseEntity<List<Board>> responseRate() {
		List<Board> result = boardservice.getBoardResponseRate();
		log.debug("result: {}", result);
		return ResponseEntity.ok(result);
	}
	//일별 회원가입 수 그래프
	@GetMapping("dailyJoin")
	@ResponseBody
	public ResponseEntity<List<User>> dailyJoin() {
	   List<User> result = userservice.getDailyJoinData();
		    
	   return ResponseEntity.ok(result);
	}
	//로그보드
	@GetMapping("logBoard")
	@ResponseBody
	public ResponseEntity<List<AllLog>> logBoard() {
		List<AllLog> result = userservice.getLogData();
		
		return ResponseEntity.ok(result);
	}
	//로그인보드
	@GetMapping("loginBoard")
	@ResponseBody
	public ResponseEntity<List<Log>> loginBoard(){
		List<Log> result = userservice.getLoginData();
		
		return ResponseEntity.ok(result);
	}
	
	//특정 유저 조회 --시간별 활동량
	@GetMapping("userLogin")
	@ResponseBody
	public ResponseEntity<List<Log>> userLogin(@RequestParam("userId") String userId) {
		List<Log> result = userservice.getUserLoginData(userId);
		return ResponseEntity.ok(result);
	}
	//특정유저조회 -- 컨텐츠별이용비율
	@GetMapping("actRate")
	@ResponseBody
	public ResponseEntity<List<AllLog>> actRate(@RequestParam("userId") String userId) {
        List<AllLog> result = userservice.getActRateData(userId);
		
		return ResponseEntity.ok(result);
	}

	
}
