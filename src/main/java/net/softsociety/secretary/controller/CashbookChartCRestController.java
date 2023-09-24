package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.CashbookChart;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookService;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@RestController
@RequestMapping("/cashbook/chart")
public class CashbookChartCRestController {
	
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
	
	
	/** 가족 당월 지출 대분류 도넛 */
	@PostMapping("donutMonthExpense")
	public ArrayList<CashbookChart> donutMonthExpense(
			Model model
			, int chYear
			, int chMonth) {
		log.debug("{}년 {}월 대분류지출 도넛 컨트롤러 도착", chYear, chMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("chYear", chYear);
		map.put("chMonth", chMonth);
		
		ArrayList<CashbookChart> result = dao.getMonthExpense(map);
		log.debug("도넛차트 들어갈 값:{}", result);
		
		return result;
	}

	
	/** 가족 당월 수입 대분류 도넛 */
	@PostMapping("donutMonthIncome")
	public ArrayList<CashbookChart> donutMonthIncome(
			Model model
			, int chYear
			, int chMonth) {
		log.debug("{}년 {}월 수입 도넛 컨트롤러 도착", chYear, chMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("chYear", chYear);
		map.put("chMonth", chMonth);
		
		ArrayList<CashbookChart> result = dao.getMonthIncome(map);
		log.debug("도넛차트 들어갈 값:{}", result);
		
		return result;
	}
	
	
	/** 가족 당월 주별 지출 */
	@PostMapping("weekExpenseAcc")
	public ArrayList<CashbookChart> weekExpenseAcc(
			Model model
			, int chYear
			, int chMonth) {
		log.debug("{}년 {}월 주차별 지출 컨트롤러 도착", chYear, chMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("chYear", chYear);
		map.put("chMonth", chMonth);
		
		ArrayList<CashbookChart> result = dao.getWeekExpenseAcc(map);
		log.debug("주차별 지출:{}", result);
		
		return result;
	}
	
	/** 6개월 수입 지출 추이 */
	@PostMapping("inExSixMonth")
	public ArrayList<CashbookChart> inExSixMonth(
			Model model
			, int chYear
			, int chMonth) {
		log.debug("{}년 {}월 6개월 추이 컨트롤러 도착", chYear, chMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("chYear", chYear);
		map.put("chMonth", chMonth);
		log.debug("6개월 추이 서버 보낼 map:{}", map);
		
		ArrayList<CashbookChart> result = dao.getInExSixMonth(map);
		log.debug("6개월 추이:{}", result);
		
		return result;		
	}
}
