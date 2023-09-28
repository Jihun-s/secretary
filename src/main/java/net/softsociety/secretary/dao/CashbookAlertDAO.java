package net.softsociety.secretary.dao;

import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

/** 가계부 알림 DAO */

@Mapper
public interface CashbookAlertDAO {

	/** 일정 추가할 때 알림에도 추가 */
	int insertAlert(HashMap<String, Object> map);

}
