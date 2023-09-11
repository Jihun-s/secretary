package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Schedule;

@Mapper
public interface ScheduleDAO {

	/** 일정 목록 불러오기 */
	ArrayList<Schedule> selectAllSche(HashMap<String, Object> map);

	/** 일정 삭제 */
	int deleteSch(HashMap<String, Object> map);

}
