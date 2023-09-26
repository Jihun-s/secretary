package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.domain.Schedule;

@Slf4j
@Service
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	ScheduleDAO dao;

	
	/** 가계부 일정 목록 가져오기 */
	@Override
	public ArrayList<Schedule> alertList(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		log.debug("일정서비스가 받은 map: {}", map);
		HashMap<String, Object> result = new HashMap<>();
		
		ArrayList<Schedule> withdrawAlert = dao.getWithdrawAlert(map);
		log.debug("일정서비스가 가져온 자동이체 이벤트:{}", withdrawAlert);
		result.put("withdrawAlert", withdrawAlert);
//		
//		ArrayList<Schedule> holidayAlert = dao.getHolidayAlert(map);
//		log.debug("일정서비스가 가져온 명경생 이벤트:{}", holidayAlert);
//		result.put("holidayAlert", holidayAlert);
		
		
		return withdrawAlert;
	}


	/** 가계부 해당월 일정 목록 가져오기 */
	@Override
	public ArrayList<Schedule> getBudgetEventList(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		log.debug("일정서비스가 받은 map: {}", map);
		
		// update인 경우
//		if (map.get("insertOrUpdate") != null && (int)map.get("insertOrUpdate") == 1) {
//			if (map.containsKey("curMonth")) {
//			    int curValue = (int) map.get("curMonth");
//			    map.put("curMonth", curValue + 1);
//			}
//		}
		
		ArrayList<Schedule> budgetEventList = dao.getBudgetEventList(map);
		log.debug("일정서비스가 가져온 이번달 이벤트:{}", budgetEventList);
		
		return budgetEventList;
	}
	
	
	
	
	
}
