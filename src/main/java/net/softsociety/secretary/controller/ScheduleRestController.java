package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@ResponseBody
@Controller
@RequestMapping("schedule")
public class ScheduleRestController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	
	/** 일정 목록 불러오기 */
	@GetMapping("list")
	public ArrayList<Schedule> list(
			Model model) {
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());

		ArrayList<Schedule> result = dao.selectAllSche(map);
		log.debug("DAO에서 받아온 일정 목록:{}", result);

		return result;
	}
	
	
	/** 일정 추가 */
	@PostMapping("insertSch")
	public int insertSch(
			Model model
			, Schedule sch) {
		log.debug("컨트롤러에 넘어온 입력할 일정 정보:{}", sch);
		
		User loginUser = (User) model.getAttribute("loginUser");
		sch.setFamilyId(loginUser.getFamilyId());
		sch.setUserId(loginUser.getUserId());
		log.debug("DAO에 보낼 입력할 일정 정보:{}", sch);
		
		int n = dao.insertSch(sch);
		
		return n;
	}
	
	
	/** 일정 삭제 */
	@PostMapping("deleteSch")
	public int deleteSch(
			Model model
			, int schId) {
		log.debug("삭제 컨트롤러 도착했어염!");
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("schId", schId);
		log.debug("DAO로 보낼 삭제할 일정 map:{}", map);

		int n = dao.deleteSch(map);
		log.debug("일정 삭제했나염?:{}", n);
		
		return n;
	}
}
