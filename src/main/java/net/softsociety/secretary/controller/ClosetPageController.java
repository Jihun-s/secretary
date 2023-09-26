package net.softsociety.secretary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesFromStore;
import net.softsociety.secretary.service.ClosetService;
import net.softsociety.secretary.util.PageNavigator;

@Slf4j
@Controller
@RequestMapping("closet")
public class ClosetPageController {

	@Autowired
	ClosetService service;

	//게시판 목록의 페이지당 글 수
	@Value("${clothesFromStore.page}")
	int countPerPage;
	//게시판 목록의 페이지 이동 링크 수
	@Value("${user.board.group}")
	int pagePerGroup;	
		
	
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
	
	
	//코디일지 페이지
	@GetMapping("styleDiary")
	public String closet2() {
		return "closetView/styleDiary";
	}

	@GetMapping("webSearch")
	public String webSearch(Model m, String SearchKeyword, String clothesFromStoreBrand, String clothesFromStoreCategory
			,@RequestParam(name="page", defaultValue="1") int page) {
		log.debug("옷 검색 키워드: {}", SearchKeyword);
		log.debug("옷 검색 브랜드: {}", clothesFromStoreBrand);
		log.debug("옷 검색 브랜드: {}", clothesFromStoreCategory);
		
		 PageNavigator navi = service.getPageNavigator(pagePerGroup, countPerPage, page, SearchKeyword, clothesFromStoreBrand, clothesFromStoreCategory);
		//옷장안에 의류리스트 불러오기
		ArrayList<ClothesFromStore> clothesList = service.findAllClothesFromStore(navi, SearchKeyword,clothesFromStoreBrand,clothesFromStoreCategory);
		m.addAttribute("list", clothesList);
		m.addAttribute("navi", navi);
		m.addAttribute("searchKeyWord", SearchKeyword);
		m.addAttribute("brand", clothesFromStoreBrand);
		m.addAttribute("category", clothesFromStoreCategory);		
		return "closetView/webSearch";
	}
	
}
