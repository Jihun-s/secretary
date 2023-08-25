package net.softsociety.secretary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.service.ClosetService;

@Slf4j
@Controller
@RequestMapping("closet")
public class ClosetPageController {

	@Autowired
	ClosetService service;
	
	// 옷장 메인화면
	@GetMapping({"", "/"})
	public String closetMain(Model model) {
		ArrayList<Closet> closetList = service.findAllCloset();
		model.addAttribute("closetList", closetList);
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
