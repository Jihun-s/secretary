package net.softsociety.secretary.controller;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Budget;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookService;

@Slf4j
@Controller
@RequestMapping("cashbook")
public class CashbookPageController {
	
	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserControllerAdvice userService;
	
	@Autowired
	UserMapper userDao;
	

	/** 메인 */
	@GetMapping({"", "/"})
	public String cashbookMain(Model model) {
		// 로그인 유저 정보 
		User loginUser = (User) model.getAttribute("loginUser");
		
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int curYear = calendar.get(Calendar.YEAR);
        int curMonth = calendar.get(Calendar.MONTH) + 1;
		
        // DAO에 보낼 맵
        HashMap<String, Object> map = new HashMap<>();
		map.put("familyId", loginUser.getFamilyId());
		map.put("budgetMonth", curMonth);
		map.put("budgetYear", curYear);
//		
//		Budget budget = dao.selectBudget(map);
//		log.debug("예산 찾을 맵:{}", map);
//		log.debug("가계부 홈에 보낼 예산:{}", budget);
//		
//		// 모델에 넣기
//		model.addAttribute("budget", budget);
		
		int budgetExist = dao.budgetExist(map);
		model.addAttribute("budgetExist", budgetExist);
		
		return "cashbookView/cashbookMain";
	}
	
	/** 내역 */
	@GetMapping("trans")
	public String cashbookTransaction() {
		
		
		
		return "cashbookView/transaction";
	}

	/** 예산 */
	@GetMapping("budget")
	public String cashbookBudget(Model model) {
		// 현재 연월 구하기
		Calendar calendar = Calendar.getInstance();
		int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        
        HashMap<String, Object> map = new HashMap<>();
        map.put("budgetYear", year);
        map.put("budgetMonth", month);
        
        // 예산 - 지출 구하기
		int remainingAmount = service.budgetRest(map);
		model.addAttribute("remainingAmount", remainingAmount);
		log.debug("{}년 {}월 남은 예산:{}", year, month, remainingAmount);
		
		return "cashbookView/budget";
	}
	
	/** 통계 */
	@GetMapping("statistic")
	public String cashbookStatistic() {
		
		return "cashbookView/statistic";
	}
	
}
