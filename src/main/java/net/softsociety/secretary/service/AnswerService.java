package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import net.softsociety.secretary.domain.Answer;

public interface AnswerService {
	//답글 입력
	int insertAnswer(Answer answer);
	//답글 불러오기
	ArrayList<Answer> read(int boardId);
	//답글 삭제
	int deleteAnswer(Answer answer);
	//답글삭제 2
	int deleteAnswer(int answerId);

}
