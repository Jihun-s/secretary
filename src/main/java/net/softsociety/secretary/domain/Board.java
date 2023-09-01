package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Board {
	int boardId;
	String userId;
	String boardContent;
	int boardStatus;
	String boardTitle;
	int boardIsPublic;
	String boardCategory1;
	String boardCategory2;
	int boardHits;
	String boardInputdate;
	
}
