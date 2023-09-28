package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookAlertDAO;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookAlertService;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@Controller
@RequestMapping("schedule")
public class ScheduleController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	
	@Autowired
	CashbookAlertService alertService;
	
	@Autowired
	CashbookAlertDAO alertDao;
	

	/** 일정 추가 */
	@PostMapping("insertSch")
	public String insertSch(
			Model model
			, Schedule sch) {
		log.debug("컨트롤러에 넘어온 입력할 일정 정보:{}", sch);
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId(); 
		
		// 일정 테이블 넣기 
		sch.setFamilyId(familyId);
		sch.setUserId(userId);
		log.debug("DAO에 보낼 입력할 일정 정보:{}", sch);
		
		int n = dao.insertSch(sch);

		if(sch.getSchType().equals("가계부")) {
			log.debug("가계부 일정이니 알림에도 넣어두겟슴");

			// 가계부 관련이면 알림 테이블 넣기
			HashMap<String, Object> map = new HashMap<>();
			map.put("familyId", familyId);
			map.put("userId", userId);
			map.put("alertTransType", sch.getSchCate()); // 수입 or 지출
			map.put("alertContent", sch.getSchContent()); // '월급날'
			map.put("alertDate", sch.getSchStart());
			log.debug("DAO에 보낼 입력할 알림 정보:{}", map);
			
			int m = alertDao.insertAlert(map);
		}
		
		
		return "redirect:/schedule";
	}

}
