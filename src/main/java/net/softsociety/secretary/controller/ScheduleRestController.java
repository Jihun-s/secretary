package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
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
}
