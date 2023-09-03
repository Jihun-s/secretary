package net.softsociety.secretary.controller;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Budget;
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
	UserMapper userdao;
	

	/** 메인 */
	@GetMapping({"", "/"})
	public String cashbookMain(Model model) {
		// 현재 연월 구하기
		Calendar calendar = Calendar.getInstance();
		int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        
        HashMap<String, Object> map = new HashMap<>();
        map.put("budgetYear", year);
        map.put("budgetMonth", month);
        // 여긴 수정하고 select해서 넣는 걸로 변경
        map.put("familyId", 1);
        map.put("cashbookId", 1);
        
        // 예산 있는지 확인하기
        Budget budget = new Budget();
        boolean budgetExist = false;
        Optional<Integer> result = dao.budgetExist(map);
        
        if(result.isPresent()) {
        	budgetExist = true;
        	
        	// 예산 구하기
        	budget = dao.selectBudget(map);
        	
        	// 예산 - 지출 구하기
        	int remainingAmount = service.budgetRest(map);
        	model.addAttribute("remainingAmount", remainingAmount);
        	log.debug("{}년 {}월 남은 예산:{}", year, month, remainingAmount);        	
        }
        model.addAttribute("budgetExist", budgetExist);
        model.addAttribute("budget", budget);
        log.debug("예산 메인에 가져갈 모델:{}", model);
        
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
