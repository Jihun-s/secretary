package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;


import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Budget;
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
	ArrayList<Transaction> selectAllTrans(HashMap<String, Object> map);

	/** 해당 월 내역 수 조회 */
	int selectTransCntMonth(HashMap<String, Object> map);
	
	/** 내역 수정 */
	int updateTrans(Transaction trans);

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

	/** 거래내역 하나 불러오기 */
	Transaction selectTrans(int transId);

	/** 소분류 name으로 id 찾기 */
	int selectCate2Id(String cate2Name);

	/** 한달 총 수입 */
	int selectSumIncomeMonth(HashMap<String, Object> map);

	/** 한달 총 지출 */
	int selectSumExpenseMonth(HashMap<String, Object> map);

	/** 검색용 전체 대분류 */
	ArrayList<Category1> selectCate1Search();

	
	/** 예산 입력 */
	int setBudget(Budget budget);

	/** 예산 - 지출 */
	Integer budgetRest(HashMap<String, Object> map);

	/** 해당 연월 예산 있는지 확인 */
	int budgetExist(HashMap<String, Object> map);

	/** 예산 가져오기 */
	Budget selectBudget(HashMap<String, Object> map);

	/** 예산 수정 */
	int updateBudget(Budget budget);

	/** 예산 삭제 */
	int deleteBudget(Budget budget);

	/** 월 총수입 총지출 */
	HashMap<String, Object> selectInExSumMonth(HashMap<String, Object> map);

	/** 예산 평균, 직전 3개월 예산 */
	HashMap<String, Object> selectBudgetAvgXXX(HashMap<String, Object> map);

	/** 총수입 총지출 예산용 */
	HashMap<String, Object> selectInExSumMonthBudget(HashMap<String, Object> map);

}
