package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookAlertDAO;
import net.softsociety.secretary.domain.CashbookAlert;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookAlertService;

/** 가계부 알림 컨트롤러 */

@Slf4j
@RestController
@RequestMapping("/cashbook/alert")
public class CashbookAlertRestController {

	@Autowired
	CashbookAlertService service;
	
	@Autowired
	CashbookAlertDAO dao;
	
	
	/** 필수알림 목록 가져오기 */
	@PostMapping("getPilsuAlert")
	public ArrayList<CashbookAlert> getPilsuAlert(
			Model model
			, String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			) {
		log.debug("필수알림 컨트로러 왔당!!!!!!!!!!!!!!!");
		
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
		log.debug("{}번 가족 {}의 {} 기준 필수알림 가져오기", familyId, userId, curDateTime);

		ArrayList<CashbookAlert> result = dao.getPilsuAlert(map);
		log.debug("화면에 출력할 필수알림 리스트:{}", result);

		
		return result;
	}
	
	
	/** 알림 삭제 */
	@PostMapping("deleteAlert")
	public void deleteAlert(
			Model model
			, int alertId) {
		log.debug("삭제할 알림번호:{}", alertId);
		
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		map.put("alertId", alertId);
		
		int n = dao.deleteAlert(map);
	}
	
	/** 필수알림 모두 삭제 */
	@PostMapping("deleteAllPilsuAlert")
	public void deleteAllPilsuAlert(
			Model model) {
		
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		log.debug("필수알림 전체 삭제할게요:{}번가족", familyId);
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		
		int n = dao.deleteAllPilsuAlert(map);
	}
}
