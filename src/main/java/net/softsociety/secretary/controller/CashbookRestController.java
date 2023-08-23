package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.service.CashbookService;

@Slf4j
@Controller
@RequestMapping("cashbook")
@ResponseBody
public class CashbookRestController {

	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	
	@GetMapping("setBudget")
	public void setBudget(int budget) {
		
	}
	
}
