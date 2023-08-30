package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Category1;
import net.softsociety.secretary.domain.Category2;
import net.softsociety.secretary.domain.Transaction;

@Mapper
public interface CashbookDAO {

	/** 내역 입력 */
	int insertTrans(Transaction trans);

	/** 유저ID 찾기 */
	String selectUserId(String username);

	/** 내역 목록 출력 */
	ArrayList<Transaction> selectAllTrans(int familyId);

	/** 해당 월 내역 수 조회 */
	int selectTransCntMonth(HashMap<String, Object> map);

	/** 내역 삭제 */
	int deleteTrans(Transaction trans);
//
//	/** 커스텀 대분류 불러오기 */
//	ArrayList<String> selectCustomCategory1(String userId);
//
//	/** 커스텀 소분류 불러오기 */
//	ArrayList<String> selectCustomCategory2(String userId);

	/** 대분류 불러오기 */
	ArrayList<Category1> selectCate1(String transType);

	/* 소분류 불러오기 */
	ArrayList<Category2> selectCate2(String cate1Name);

	/** 커스텀 대분류 추가 */
	int insertCustomCate1(Category1 cate1);

	/** 대분류 name으로 id 찾기 */
	int selectCate1Id(String cate1Name);

	/** 커스텀 소분류 추가 */
	int insertCustomCate2(Category2 cate2);

}
