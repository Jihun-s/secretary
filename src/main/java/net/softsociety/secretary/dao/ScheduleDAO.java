package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import net.softsociety.secretary.domain.Schedule;

@Mapper
@Repository
public interface ScheduleDAO {

	/** 일정 목록 불러오기 */
	ArrayList<Schedule> selectAllSche(HashMap<String, Object> map);
	
	/** 일정 추가 */
	int insertSch(Schedule sch);

	/** 일정 삭제 */
	int deleteSch(HashMap<String, Object> map);

	/** 일정 수정 */
	int updateSch(Schedule sch);

	/** 일정 하나 찾기 */
	Schedule selectOne(HashMap<String, Object> map);

	/** 일정 목록 불러오기 오른쪽 */
	ArrayList<Schedule> selectAllScheList(HashMap<String, Object> map);

	/** 월급날 알림 */
	ArrayList<Schedule> getSalaryAlert(HashMap<String, Object> map);

	/** 자동결제 알림 */
	ArrayList<Schedule> getWithdrawAlert(HashMap<String, Object> map);

	/** 명경생 알림 */
	ArrayList<Schedule> getHolidayAlert(HashMap<String, Object> map);

	/** 예산월 일정 목록 */
	ArrayList<Schedule> getBudgetEventList(HashMap<String, Object> map);

	/** 오늘 이후 일정 목록 */
	ArrayList<Schedule> selectAllScheListAfter(HashMap<String, Object> map);

}
