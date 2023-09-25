package net.softsociety.secretary.domain;

import javax.persistence.Transient;

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
	//그래프 출력용
	String postingDate; 
    int dailyPostCount;
    int totalInquiryPosts;
    int answeredPosts;
}


