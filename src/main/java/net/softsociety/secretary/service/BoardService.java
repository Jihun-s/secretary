package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.List;

import net.softsociety.secretary.domain.Answer;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.util.PageNavigator;


public interface BoardService {
	//글작성
	int write(Board b);
	//글읽기
	Board read(int boardId);
	//답글 불러오기
	ArrayList<Answer> answerList(int boardId);
	//삭제하기
	int deleteOne(int boardId);
	//답글 입력
	int insertAnswer(Answer a);
	//페이지 정보 생성
	PageNavigator getPageNavigator(int pagePerGroup, int countPerPage, int page, String boardCategory1,
									String boardCategory2);
	//현재 페이지 불러오기
	ArrayList<Board> getBoardList(PageNavigator navi, String boardCategory1, String boardCategory2);
	//글수정 (문의)
	int update(Board b);
	//글수정
	Board upread(int num);
	//답변상태 업데이트
	int updateBoardStatus(int boardId);
	//일별 게시물 수 조회
	List<Board> getBoardData();
	//답변률 계산
	List<Board> getBoardResponseRate();
	//board_status를 false로 변경
	int updateBoardStatusToFalse(int boardId);
	




	

	

}
