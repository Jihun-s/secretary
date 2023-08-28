package net.softsociety.secretary.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Transaction;

@Mapper
public interface CashbookDAO {

	/** 내역 입력 */
	int insertTrans(Transaction trans);

	/** 유저ID 찾기 */
	String selectUserId(String username);

	/** 내역 목록 출력 */
	ArrayList<Transaction> selectAllTrans();

	/** 해당 월 내역 수 조회 */
	int selectTransCntMonth(int curMonth);

	/** 내역 삭제 */
	int deleteTrans(Transaction trans);

}
