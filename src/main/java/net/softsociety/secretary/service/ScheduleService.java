package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import net.softsociety.secretary.domain.Schedule;

public interface ScheduleService {

	/** 가계부 일정 목록 가져오기 */
	ArrayList<Schedule> alertList(HashMap<String, Object> map);

	/** 가계부 해당월 일정 목록 가져오기 */
	ArrayList<Schedule> getBudgetEventList(HashMap<String, Object> map);

}
