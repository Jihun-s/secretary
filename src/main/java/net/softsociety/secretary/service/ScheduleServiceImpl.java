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
		
		ArrayList<Schedule> cardAlert = dao.getCardAlert(map);
		log.debug("일정서비스가 가져온 cardAlert:{}", cardAlert);
		result.put("cardAlert", cardAlert);
		
//		ArrayList<Schedule> salaryAlert = dao.getSalaryAlert(map);
//		log.debug("일정서비스가 받은 salaryAlert:{}", salaryAlert);
		
		return cardAlert;
	}
	
	
	
	
	
}
