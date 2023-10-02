package net.softsociety.secretary.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Budget;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookService;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@RequestMapping("/cashbook/budget")
@RestController
public class CashbookBudgetRestController {

	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;
	
	@Autowired
	ScheduleService schService;
	
	@Autowired
	ScheduleDAO schDao;
	
	
	/** 예산 입력 */
	@PostMapping("setBudget")
	public void setBudget(@AuthenticationPrincipal UserDetails user
			, Budget budget, Model model) {
		log.debug("컨트롤러에 넘어온 예산:{}", budget);
		
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int budgetMonth = calendar.get(Calendar.MONTH) + 1;
        int budgetYear = calendar.get(Calendar.YEAR);
		
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		
		// 유저id로 familyId 찾기
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		
		// budget에 넣기
		budget.setFamilyId(familyId);
		budget.setCashbookId(familyId);
		budget.setBudgetYear(budgetYear);
		budget.setBudgetMonth(budgetMonth);
		log.debug("DAO에 넘길 budget:{}", budget);
		
		int n = dao.setBudget(budget);
	}
	
	/** 예산 수정 */
	@PostMapping("updateBudget")
	public void updateBudget(@AuthenticationPrincipal UserDetails user
			, Budget budget, Model model) {
		log.debug("컨트롤러에 넘어온 수정할 예산:{}", budget);
		
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
		int budgetMonth = calendar.get(Calendar.MONTH) + 1;
		int budgetYear = calendar.get(Calendar.YEAR);
		
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		
		// budget에 넣기
		budget.setFamilyId(familyId);
		budget.setBudgetYear(budgetYear);
		budget.setBudgetMonth(budgetMonth);
		log.debug("DAO에 넘길 budget:{}", budget);
		
		int n = dao.updateBudget(budget);
	}
	
	/** 예산 삭제 */
	@PostMapping("deleteBudget")
	public void deleteBudget(@AuthenticationPrincipal UserDetails user
			, int curYear
			, int  curMonth
			, Model model) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("familyId", familyId);
		map.put("budgetYear", curYear);
		map.put("budgetMonth", curMonth);
		Budget budget = dao.selectBudget(map);
		
		int n = dao.deleteBudget(budget);
		
	}
	
	/** 예산월 이벤트 목록 */
	@GetMapping("budgetEventList")
	public ArrayList<Schedule> budgetEventList(
			Model model
			, String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			, int insertOrUpdate) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		map.put("curDateTime", curDateTime);
		map.put("curYear", curYear);
		map.put("curMonth", curMonth);
		map.put("curDate", curDate);
		map.put("insertOrUpdate", insertOrUpdate);
		log.debug("{}번 가족 {}의 {}월 일정 가져오기", familyId, userId, curMonth);

		ArrayList<Schedule> result = schService.getBudgetEventList(map);
		
		return result;
	}
	
	/** 이번달 예산 조회 */
	@GetMapping("getBudgetRest")
	public BigDecimal getBudgetRest(
			int curYear
			, int  curMonth
			, Model model) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		map.put("curYear", curYear);
		map.put("curMonth", curMonth);
		
		BigDecimal result = dao.getBudgetRest(map);
		log.debug("{}년 {}월 남은 예산: {}", curYear, curMonth, result);
		
		return result;
	}
}
