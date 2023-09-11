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
@Controller
@RequestMapping("schedule")
public class ScheduleController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	

	/** 일정 추가 */
	@PostMapping("insertSch")
	public String insertSch(
			Model model
			, Schedule sch) {
		log.debug("컨트롤러에 넘어온 입력할 일정 정보:{}", sch);
		
		User loginUser = (User) model.getAttribute("loginUser");
		sch.setFamilyId(loginUser.getFamilyId());
		sch.setUserId(loginUser.getUserId());
		log.debug("DAO에 보낼 입력할 일정 정보:{}", sch);
		
		int n = dao.insertSch(sch);
		
		return "redirect:/schedule";
	}

}
