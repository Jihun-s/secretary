package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import net.softsociety.secretary.domain.Answer;
import net.softsociety.secretary.domain.Board;

@Mapper
public interface BoardDAO {
	//문의글 작성
	public int write(Board b);
	//글 목록으로 이동
	public ArrayList<Board> listBoard();
	//글 읽기
	public Board read(int boardId);
	//글목록(에이젝스)
	public ArrayList<Board> selectAllBoard();
	//글삭제
	public int deleteOne(int boardId);
	// 답글목록
	public ArrayList<Answer> answerList(int boardId);
	//답글 입력
	public int insertAnswer(Answer a);
	//현재페이지
	public int getTotal(HashMap<String, String> map);
	
	public ArrayList<Board> list(HashMap<String, Object> map, RowBounds rb);
	//조회수
	public int addhits(int boardId);
	//글수정 (문의)
	public int update(Board b);
	
	public Board selectOne(int boardId);
	//답변상태 업데이트
	public int updateBoardStatus(int boardId);
	//일별 게시물수 조회
	public List<Board> getBoardData();
	//답변률
	public List<Board> getBoardResponseRate();
	//false로 변경
	public int updateBoardStatusToFalse(int boardId);
	
	

	

}
