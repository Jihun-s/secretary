package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Transaction;
import net.softsociety.secretary.service.CashbookService;

@Slf4j
@RequestMapping("/cashbook/trans")
@RestController
public class CashbookTransRestController {
	
	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;
	
	
	/** 내역 입력 */
	@PostMapping("setTrans")
	public void setBudget(Transaction trans, @AuthenticationPrincipal UserDetails user) {
		log.debug("넘어온 거래내역:{}", trans);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		
		// cashbookId, familyId 임의로 입력
		trans.setCashbookId(1);
		trans.setFamilyId(1);
		log.debug("입력할 거래내역:{}", trans);
		log.debug("입력할 cashbookId:{}", trans.getCashbookId());
		
		int n = service.insertTrans(trans);
		
	}
	
	/** 내역 목록 출력 */
	@GetMapping("list")
	public ArrayList<Transaction> list() {
		
		ArrayList<Transaction> result = dao.selectAllTrans();
		log.debug("출력할 내역목록:{}", result);
		
		return result;
	}
	
	/** 월간 내역 개수 출력 */
	@GetMapping("cntMonth")
	public int cntMonth() {
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int curMonth = calendar.get(Calendar.MONTH) + 1;
        
		int result = dao.selectTransCntMonth(curMonth);
		log.debug("출력할 내역 개수:{}", result);
		
		return result;
	}
	
	/** 내역 삭제 */
	@PostMapping("deleteTrans")
	public void deleteTrans(int transId, @AuthenticationPrincipal UserDetails user) {
		log.debug("삭제할 거래번호:{}", transId);
		
		Transaction trans = new Transaction();
		trans.setTransId(transId);
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		log.debug("삭제할 거래내역:{}", trans);
		
		int n = service.deleteTrans(trans);
		
	}
	
}
