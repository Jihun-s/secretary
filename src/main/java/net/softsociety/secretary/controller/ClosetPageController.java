package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("closet")
public class ClosetPageController {

	// 옷장 메인화면
	@GetMapping({"", "/"})
	public String closetMain() {
		
		return "closetView/closetMain";
	}
	
	// 옷장 상세1
	@GetMapping("InCloset1")
	public String closet1() {
		
		return "closetView/InCloset1";
	}
	
	// 옷장 상세2
	@GetMapping("InCloset2")
	public String closet2() {
		
		return "closetView/InCloset2";
	}
	
}
