package net.softsociety.secretary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.domain.Schedule;
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
	public ArrayList<Schedule> list() {
		ArrayList<Schedule> result = new ArrayList<>();
		// 테스트
		Schedule sch = new Schedule();
		sch.setSchId(1);
		sch.setUserId("soyo");
		sch.setFamilyId(1);
		sch.setSchType("가계부");
		sch.setSchCate("지출");
		sch.setSchLevel(2);
		sch.setSchContent("카드값 내세염");
		sch.setSchStart("2023-09-13");
		sch.setSchEnd("2023-09-13");
		sch.setSchAllday(1);
		
		result.add(sch);
		
		return result;
	}
}
