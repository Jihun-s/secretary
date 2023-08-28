package net.softsociety.secretary.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Board;

@Mapper
public interface BoardDAO {
	//문의글 작성
	int write(Board b);
	//글 목록
	ArrayList<Board> listBoard();
	//글 읽기
	Board read(int boardId);
	//글목록
	ArrayList<Board> selectAllBoard();
	//글삭제
	int deleteBoard(int boardId);

	

}
