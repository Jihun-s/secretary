package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Transaction;
import net.softsociety.secretary.service.CashbookService;

@Slf4j
@Controller
@RequestMapping("/cashbook/trans")
public class CashbookTransController {
	
	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;

	/** 내역 입력 */
	@PostMapping("setTrans")
	public String setBudget(Transaction trans, @AuthenticationPrincipal UserDetails user) {
		log.debug("넘어온 거래내역:{}", trans);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		
		// cashbookId, familyId 임의로 입력
		trans.setCashbookId(1);
		trans.setFamilyId(1);
		log.debug("입력할 거래내역:{}", trans);
		
		int n = service.insertTrans(trans);
		
		return "redirect:/cashbook/trans";
	}
	
}
