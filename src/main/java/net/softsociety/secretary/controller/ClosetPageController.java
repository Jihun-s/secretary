package net.softsociety.secretary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;
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
		//옷장목록 불러오기
		ArrayList<Closet> closetList = service.findAllCloset();
		model.addAttribute("closetList", closetList);
		return "closetView/closetMain";
	}
	
	// 옷장 상세
	@GetMapping("InCloset")
	public String InclosetPage(@RequestParam(name="closetNum") int closetNum
								, Model model) {
		model.addAttribute("closetNum", closetNum);
		return "closetView/InCloset";
	}
	
	// 세탁바구니 페이지
	@GetMapping("laundryPage")
	public String laundryPage() {
		return "closetView/Laundry";
	}
	
	//모든 옷장에서 의류목록 보기(메인페이지 검색기능)
	@GetMapping("AllCloset")
	public String AllClosetPage() {
		return "closetView/AllCloset";		
	}
	
	
	// 옷장 상세2
	@GetMapping("InCloset2")
	public String closet2() {
		
		return "closetView/InCloset2";
	}
	
	@GetMapping("webSearch")
	public String webSearch() {
		return "closetView/webSearch";
	}
	
}
