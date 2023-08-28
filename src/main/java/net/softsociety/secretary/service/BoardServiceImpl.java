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
	//글 작성
	@Override
	public int write(Board b) {	
			log.debug("service : {}", b);
		return dao.write(b);
	}
//	//글읽기
//	@Override
//	public Board read(int boardId) {
//		
//		return dao.read(boardId);
//	}
	//글삭제
	@Override
	public int deleteBoard(int boardId) {
		int n = dao.deleteBoard(boardId);
		return n;
	}
	//글읽기
	@Override
	public Board getboardContent(int boardId) {
		return dao.read(boardId); 
	}
	

}
