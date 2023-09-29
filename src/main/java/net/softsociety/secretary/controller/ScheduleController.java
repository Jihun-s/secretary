package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
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
		
		// 방금 넣은 일정의 sch_id 찾아오기 
		HashMap<String, Object> map1 = new HashMap<>();
		map1.put("familyId", familyId);
		map1.put("userId", userId);
		map1.put("schType", sch.getSchType());
		map1.put("schCate", sch.getSchCate());
		map1.put("schContent", sch.getSchContent());
		map1.put("schStart", sch.getSchStart());
		Schedule inserted = dao.selectOneAlert(map1);
		log.debug("방금 입력한 일정:{}", inserted);
		
		// 생일 경조사 명절이면 알림 테이블 넣기
		if(sch.getSchCate().equals("생일") 
				|| sch.getSchCate().equals("경조사")
				|| sch.getSchCate().equals("명절")
				) {
			log.debug("생경명 일정이니 알림에도 넣어두겟슴");
			
			HashMap<String, Object> map = new HashMap<>();
			map.put("familyId", familyId);
			map.put("userId", userId);
			map.put("alertType", "필수");
			map.put("alertTransType", "지출"); // 수입 or 지출
			map.put("alertContent", sch.getSchContent()); // '소영 생일'
			map.put("alertDate", sch.getSchStart());
			map.put("schId", inserted.getSchId());
			log.debug("DAO에 보낼 입력할 생경명 알림 정보:{}", map);
			
			int m = alertDao.insertAlert(map);
		}
		
		
		// 가계부 관련이면 알림 테이블 넣기
		if(sch.getSchType().equals("가계부")) {
			log.debug("가계부 일정이니 알림에도 넣어두겟슴");

			HashMap<String, Object> map = new HashMap<>();
			map.put("familyId", familyId);
			map.put("userId", userId);
			map.put("alertType", "필수");
			map.put("alertTransType", sch.getSchCate()); // 수입 or 지출
			map.put("alertContent", sch.getSchContent()); // '월급날'
			map.put("alertDate", sch.getSchStart());
			map.put("schId", inserted.getSchId());
			log.debug("DAO에 보낼 입력할 가계부 알림 정보:{}", map);
			
			int m = alertDao.insertAlert(map);
		}
		
		
		return "redirect:/schedule";
	}

}
