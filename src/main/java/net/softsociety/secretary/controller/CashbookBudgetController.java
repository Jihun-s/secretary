package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

/** 예산 컨트롤러 */

@Slf4j
@Controller
@RequestMapping("cashbook")
public class CashbookBudgetController {

	/** 예산 설정 */
	@PostMapping("setBudget")
	public String setBudget(int budgetAmount) {
		log.debug("넘어온 예산:{}", budgetAmount);
	
		return "redirect:/cashbook/";
	}
	
}
