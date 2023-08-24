package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.BoardDAO;
import net.softsociety.secretary.domain.Board;

@Service
@Slf4j
public class BoardServiceImpl implements BoardService {
	
	@Autowired
	BoardDAO dao;

	@Override
	public int write(Board b) {
		return dao.write(b);
	}

}
