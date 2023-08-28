package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.domain.Transaction;

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
	
	
	
	
}
