package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.domain.Category1;
import net.softsociety.secretary.domain.Category2;
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
		log.debug("서비스 넘어온 입력할 거래내역:{}", trans);
		
		// 대분류 선택됨
		if(!trans.getCate1Name().equals("대분류를 선택하세요")) {
			int cate1Id = dao.selectCate1Id(trans.getCate1Name());
			log.debug("찾아온 대분류id:{}", cate1Id);
			trans.setCate1Id(cate1Id);
			log.debug("대분류 id 넣은 거래내역:{}", trans);
			
			// 지출 소분류 선택됨
			if(trans.getTransType().equals("지출") && !trans.getCate2Name().equals("소분류를 선택하세요")) {
				int cate2Id = dao.selectCate2Id(trans.getCate2Name());
				trans.setCate2Id(cate2Id);
			}
		}	
		
		// DAO 보내기
		log.debug("서비스에서 다오 주는 입력할 거래내역:{}", trans);
		int n = dao.insertTrans(trans);
		
		return n;
	}
	
	/** 내역 수정 */
	@Override
	public int updateTrans(Transaction trans) {
		// TODO Auto-generated method stub
		log.debug("서비스 넘어온 수정할 거래내역:{}", trans);
		
		// 대분류 선택됨
		if(!trans.getCate1Name().equals("대분류를 선택하세요")) {
			int cate1Id = dao.selectCate1Id(trans.getCate1Name());
			log.debug("찾아온 새로운 대분류id:{}", cate1Id);
			trans.setCate1Id(cate1Id);
			trans.setCate1Id(cate1Id);
			log.debug("새로운 대분류 id 넣은 거래내역:{}", trans);
			
			// 지출 소분류 선택됨
			if(trans.getTransType().equals("지출") && !trans.getCate2Name().equals("소분류를 선택하세요")) {
				int cate2Id = dao.selectCate2Id(trans.getCate2Name());
				log.debug("찾아온 새로운 소분류id:{}", cate1Id);
				trans.setCate2Id(cate2Id);
				log.debug("새로운 소분류 id 넣은 거래내역:{}", trans);
			}
		}	
		
		// DAO 보내기
		log.debug("서비스에서 다오 주는 수정할 거래내역:{}", trans);
		int n = dao.updateTrans(trans);
		
		return n;
	}

	/** 내역 삭제 */
	@Override
	public int deleteTrans(Transaction trans) {
		// TODO Auto-generated method stub
		int n = dao.deleteTrans(trans);
		
		return n;
	}

	/** 커스텀 대분류 추가 */
	@Override
	public int addCustomCate1(Category1 cate1) {
		// TODO Auto-generated method stub		
		int n = dao.insertCustomCate1(cate1);
		
		return n;
	}

	/** 커스텀 소분류 추가 */
	@Override
	public int addCustomCate2(Category2 cate2, String cate1Name) {
		// TODO Auto-generated method stub
		// 대분류 id 찾기
		int cate1Id = dao.selectCate1Id(cate1Name);
		log.debug("서비스에서 찾아온 대카테명:{}, 대카테id:{}", cate1Name, cate1Id);
		cate2.setCate1Id(cate1Id);
		
		int n = dao.insertCustomCate2(cate2);
		
		return n;
	}

	/** 예산 - 지출 구하기 */
	@Override
	public int budgetRest(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		int result = dao.budgetRest(map);
		
		return result;
	}

}
