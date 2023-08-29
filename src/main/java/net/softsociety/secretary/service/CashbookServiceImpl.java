package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.domain.Transaction;

@Slf4j
@Service
@Transactional
public class CashbookServiceImpl implements CashbookService {

	@Autowired
	CashbookDAO dao;

	/** 내역 입력 */
	@Override
	public int insertTrans(Transaction trans) {
		// TODO Auto-generated method stub
		int n = dao.insertTrans(trans);
		
		return n;
	}

	/** 내역 삭제 */
	@Override
	public int deleteTrans(Transaction trans) {
		// TODO Auto-generated method stub
		int n = dao.deleteTrans(trans);
		
		return n;
	}

	/** 커스텀 카테고리 불러오기 */
	@Override
	public HashMap<String, ArrayList<String>> getAllCategories(String userId) {
		// TODO Auto-generated method stub
		HashMap<String, ArrayList<String>> result = new HashMap<>();
		
		ArrayList<String> result1 = dao.selectCustomCategory1(userId);
		ArrayList<String> result2 = dao.selectCustomCategory2(userId);
		log.debug("result1 대분류:{}", result1);
		log.debug("result2 소분류:{}", result2);

		result.put("cate1custom", result1);
		result.put("cate2custom", result2);
		
		return result;
	}
	
	
	
	
}
