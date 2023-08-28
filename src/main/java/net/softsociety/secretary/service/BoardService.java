package net.softsociety.secretary.service;

import net.softsociety.secretary.domain.Board;

public interface BoardService {

	int write(Board b);

	//Board read(int boardId);

	int deleteBoard(int boardId);

	Board getboardContent(int boardId);

	

}
