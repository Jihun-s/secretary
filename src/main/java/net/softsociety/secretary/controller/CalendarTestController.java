package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CalendarTestController {
	
	@GetMapping("month_view")
	public String month_view() {
		return "month-view";
	}
}
