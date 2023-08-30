package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import net.softsociety.secretary.domain.Transaction;

public interface CashbookService {

	/** 내역 입력 */
	int insertTrans(Transaction trans);

	/** 내역 삭제 */
	int deleteTrans(Transaction trans);

	/** 커스텀 카테고리 불러오기 */
	HashMap<String, ArrayList<String>> getAllCategories(String userId);

}
