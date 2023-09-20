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
	
	
	
	
	
}
