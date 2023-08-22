package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("fridge")
public class FridgePageController {

	// 냉장고 메인화면
	@GetMapping({"", "/"})
	public String fridgeMain() {
		
		return "fridgeView/fridgeMain";
	}
	
	// 냉장고 상세1
	@GetMapping("1")
	public String fridge1() {
		
		return "fridgeView/fridge1";
	}
	
	// 냉장고 상세2
	@GetMapping("2")
	public String fridge2() {
		
		return "fridgeView/fridge2";
	}
	
}
