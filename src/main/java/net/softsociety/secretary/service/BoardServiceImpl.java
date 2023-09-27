package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.BoardDAO;
import net.softsociety.secretary.domain.Answer;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.util.PageNavigator;

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
	//글읽기
	@Override
	@Transactional 
	public Board read(int boardId) {
		int num = dao.addhits(boardId);
		log.debug("조회 {}", num);
		Board b = dao.read(boardId);
		return b;
	}
	//글삭제
	@Override
	public int deleteOne(int boardId) {
		int n = dao.deleteOne(boardId);
		return n;
	}
	//답글 불러오기
	@Override
	public ArrayList<Answer> answerList(int boardId) {
		ArrayList<Answer> answerList = dao.answerList(boardId);
		return answerList;
	}
	//답글 입력
	@Override
	public int insertAnswer(Answer a) {
		int n = dao.insertAnswer(a);
		return n;
	}
	//게시판
	@Override
	public ArrayList<Board> getBoardList(PageNavigator navi, String boardCategory1, String boardCategory2) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("boardCategory1", boardCategory1);
		map.put("boardCategory2", boardCategory2);
		
		RowBounds rb =new RowBounds(navi.getStartRecord(), navi.getCountPerPage());

		ArrayList<Board> list = dao.list(map, rb);
		return list;
	}
	//페이지 정보
	@Override
	public PageNavigator getPageNavigator(int pagePerGroup, int countPerPage, int page, String boardCategory1,
										  String boardCategory2) {
		HashMap<String, String> map = new HashMap<>();
		map.put("boardCategory1", boardCategory1);
		map.put("boardCategory2", boardCategory2);
			
		int total = dao.getTotal(map);
			
		PageNavigator navi = new PageNavigator(pagePerGroup, countPerPage, page, total);
			
		return navi;
	}
	//문의 글 수정
	@Override
	public int update(Board b) {
		int n = dao.update(b);
		return n;
	}
	//수정 시 해당 글 조회(조회수증가 x)
	@Override
	public Board upread(int boardId) {
		Board b = dao.selectOne(boardId);
		return b;
	}
	//답변 상태 수정
	@Override
	public int updateBoardStatus(int boardId) {
		int n = dao.updateBoardStatus(boardId);
		return n;
	}
	//답변상태 수정 false
	@Override
	public int updateBoardStatusToFalse(int boardId) {
		return dao.updateBoardStatusToFalse(boardId);
	}
	//일별 게시물 수 조회
	@Override
	public List<Board> getBoardData() {
		
		return dao.getBoardData();
	}
	//답변률 계산
	@Override
	public List<Board> getBoardResponseRate() {
		
		return dao.getBoardResponseRate();
	}
	

	
	

}
