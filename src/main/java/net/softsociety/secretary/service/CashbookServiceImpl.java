package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.softsociety.secretary.dao.CashbookDAO;

@Service
@Transactional
public class CashbookServiceImpl implements CashbookService {

	@Autowired
	CashbookDAO dao;
	
}
