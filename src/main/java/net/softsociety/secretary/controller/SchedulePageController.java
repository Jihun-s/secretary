package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.service.ScheduleService;

/** 
 * 일정 페이지 컨트롤러
 * */

@Slf4j
@Controller
@RequestMapping("schedule")
public class SchedulePageController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	

	@GetMapping({"", "/"})
	public String scheduleMain() {
		
		return "scheduleView/scheduleMain";
	}
}
