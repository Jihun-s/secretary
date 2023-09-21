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
		
		int budgetExist = dao.budgetExist(map);
		model.addAttribute("budgetExist", budgetExist);
		
		return "cashbookView/cashbookMain";
	}
	
	/** 내역 */
	@GetMapping("trans")
	public String cashbookTransaction() {
		
		return "cashbookView/transaction";
	}
	
	/** 내역 달력 */
	@GetMapping("transCal")
	public String cashbookTransCal() {
		
		return "cashbookView/transactionCalendar";
	}

	/** 예산 */
	@GetMapping("budget")
	public String cashbookBudget(Model model) {
		
		return "cashbookView/budget";
	}
	
	/** 통계 */
	@GetMapping("chart")
	public String cashbookStatistic() {
		
		return "cashbookView/chart";
	}
	
}
