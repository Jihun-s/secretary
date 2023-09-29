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
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.ScheduleService;

@Slf4j
@ResponseBody
@Controller
@RequestMapping("schedule")
public class ScheduleRestController {
	
	@Autowired
	ScheduleService service;
	
	@Autowired
	ScheduleDAO dao;
	
	/** 일정 불러오기 */
	@GetMapping("loadSch")
	public ArrayList<Schedule> loadSCh(
			Model model) {
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());

		ArrayList<Schedule> result = dao.selectAllSche(map);
		log.debug("DAO에서 받아온 왼쪽 일정 목록:{}", result);

		return result;
	}
	
	/** 일정 목록 불러오기 */
	@GetMapping("loadSchList")
	public ArrayList<Schedule> loadSChList(
			Model model
			, Integer schYear
			, Integer schMonth) {
		log.debug("일정 목록 가져올 연월:{}{}", schYear, schMonth);
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("schYear", schYear);
		map.put("schMonth", schMonth);
		log.debug("오른쪽 일정 목록 가져오려고 DAO 보낼 map:{}", map);
		
		ArrayList<Schedule> result = dao.selectAllScheList(map);
		log.debug("DAO에서 받아온 오른쪽 일정 목록:{}", result);
		
		return result;
	}
	
	
	/** 오늘 이후 일정 목록 불러오기 */
	@GetMapping("loadSchListAfter")
	public ArrayList<Schedule> loadSChListAfter(
			Model model
			, Integer schYear
			, Integer schMonth) {
		log.debug("오늘 이후 일정 목록 가져올 연월:{}{}", schYear, schMonth);
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("schYear", schYear);
		map.put("schMonth", schMonth);
		log.debug("오른쪽 일정 목록 가져오려고 DAO 보낼 map:{}", map);
		
		ArrayList<Schedule> result = dao.selectAllScheListAfter(map);
		log.debug("DAO에서 받아온 오른쪽 일정 목록:{}", result);
		
		return result;
	}


	/** 일정 삭제 */
	@PostMapping("deleteSch")
	public int deleteSch(
			Model model
			, int schId) {
		log.debug("삭제 컨트롤러 도착했어염!");
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("schId", schId);
		log.debug("DAO로 보낼 삭제할 일정 map:{}", map);

		Schedule sch = dao.selectOne(map);
		log.debug("삭제할 일정 정보:{}", sch);
		
		int n = dao.deleteSch(map);
		log.debug("일정 삭제했나염?:{}", n);
		
		// 알림도 같이 삭제 
		
		
		return n;
	}
	
	
	/** 일정 수정 */
	@PostMapping("updateSch")
	public int updateSch(
			Model model
			, Schedule sch) {
		log.debug("컨트롤러 도착한 수정할 일정:{}", sch);
		
		User loginUser = (User) model.getAttribute("loginUser");
		sch.setFamilyId(loginUser.getFamilyId());
		sch.setUserId(loginUser.getUserId());
		log.debug("DAO로 보낼 수정할 일정:{}", sch);
		
		int n = dao.updateSch(sch);
		log.debug("일정 수정했나염?:{}", n);
		
		return n;
	}
	
	
	/** 일정 하나 불러오기 */
	@PostMapping("selectOne")
	public Schedule selectOne(
			int schId
			, Model model) {
		log.debug("컨트롤러로 {}번 일정을 찾아올거예요", schId);
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("schId", schId);
		log.debug("DAO로 보낼 일정 찾는 map:{}", map);
		
		Schedule result = dao.selectOne(map);
		log.debug("컨트롤러가 찾아온 일정 하나:{}", result);
		
		return result;
	}
}
