package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import net.softsociety.secretary.domain.Category1;
import net.softsociety.secretary.domain.Category2;
import net.softsociety.secretary.domain.Transaction;

public interface CashbookService {

	/** 내역 입력 */
	int insertTrans(Transaction trans);
	
	/** 내역 수정 */
	int updateTrans(Transaction trans);

	/** 내역 삭제 */
	int deleteTrans(Transaction trans);

	/** 커스텀 대분류 추가 */
	int addCustomCate1(Category1 cate1);

	/** 커스텀 소분류 추가 
	 * @param cate1Name */
	int addCustomCate2(Category2 cate2, String cate1Name);

	/** 예산-지출 */
	int budgetRest(HashMap<String, Object> map);

}
