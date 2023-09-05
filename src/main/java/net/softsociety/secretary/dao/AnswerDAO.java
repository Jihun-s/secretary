package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Answer;

@Mapper
public interface AnswerDAO {
	//답글작성
	public int insertAnswer(Answer answer);
	//답글 불러오기
	public ArrayList<Answer> read(int boardId);
	//답글 삭제
	public int deleteAnswer(Answer answer);
	public int deleteAnswer(int answerId);

}
