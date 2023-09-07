package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@RestController
@RequestMapping("schedule")
public class ScheduleRestController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	
}
