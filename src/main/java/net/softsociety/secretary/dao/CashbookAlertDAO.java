package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.CashbookAlert;

/** 가계부 알림 DAO */

@Mapper
public interface CashbookAlertDAO {

	/** 일정 추가할 때 알림에도 추가 */
	int insertAlert(HashMap<String, Object> map);
	
	/** 필수 알림 목록 불러오기 */
	ArrayList<CashbookAlert> getPilsuAlert(HashMap<String, Object> map);

	/** 제안 알림 목록 불러오기 */
	ArrayList<CashbookAlert> getJeahnAlert(HashMap<String, Object> map);

	/** 알림 삭제 */
	int deleteAlert(HashMap<String, Object> map);

	/** 필수알림 전체 삭제 */
	int deleteAllPilsuAlert(HashMap<String, Object> map);

	/** 제안알림 전체 삭제 */
	int deleteAllJeahnAlert(HashMap<String, Object> map);

}
