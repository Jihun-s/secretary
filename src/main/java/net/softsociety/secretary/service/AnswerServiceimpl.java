package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.AnswerDAO;
import net.softsociety.secretary.domain.Answer;

@Service
@Slf4j
public class AnswerServiceimpl implements AnswerService {
	@Autowired
	AnswerDAO dao;
	//답글 작성
	@Override
	public int insertAnswer(Answer answer) {
		int n = dao.insertAnswer(answer);
		return n;
	}
	//답글 불러오기
	@Override
	public ArrayList<Answer> read(int boardId) {
		ArrayList<Answer> answer = dao.read(boardId);
		return answer;
	}
	//답글 삭제
	@Override
	public int deleteAnswer(Answer answer) {
		int n = dao.deleteAnswer(answer);
		return n;
	}
	//답글삭제2
	@Override
	public int deleteAnswer(int answerId) {
		int n = dao.deleteAnswer(answerId);
		return 0;
	}

}
