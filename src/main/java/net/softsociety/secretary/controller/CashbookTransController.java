package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Transaction;

@Slf4j
@Controller
@RequestMapping("/cashbook/trans")
public class CashbookTransController {

	/** 내역 입력 */
	@PostMapping("setTrans")
	public String setBudget(Transaction trans) {
		log.debug("넘어온 거래정보:{}", trans);
		
		return "redirect:/cashbook/trans";
	}
	
}
