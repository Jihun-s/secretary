package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.service.LogService;

@Controller
@RequestMapping("log")
public class LogController {
	@Autowired
	private LogService logservice;
	
	@GetMapping("showLogs")
	public String showlogs(Model m) {
		List<Log> logs = logservice.getAllLogs();
		m.addAttribute("logs", logs);
		return "logView/logs";
	}
}
