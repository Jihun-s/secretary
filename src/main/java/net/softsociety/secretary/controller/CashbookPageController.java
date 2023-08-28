package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("cashbook")
public class CashbookPageController {

	/** 메인 */
	@GetMapping({"", "/"})
	public String cashbookMain() {
		
		return "cashbookView/cashbookMain";
	}
	
	/** 내역 */
	@GetMapping("trans")
	public String cashbookTransaction() {
		
		return "cashbookView/transaction";
	}

	/** 예산 */
	@GetMapping("budget")
	public String cashbookBudget() {
		
		return "cashbookView/budget";
	}
	
	/** 통계 */
	@GetMapping("statistic")
	public String cashbookStatistic() {
		
		return "cashbookView/statistic";
	}
	
}
