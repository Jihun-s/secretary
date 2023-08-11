package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class HomeController {

	/**
	 * 메인화면
	 */
	@GetMapping({"", "/"})
	public String home() {
		return "/html/index";
	}
	
}
