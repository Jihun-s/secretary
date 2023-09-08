package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

	private int schId;
	private String userId;
	private int familyId;
	private String schType;
	private String schCate;
	private int schLevel;
	private String schContent;
	private String schStart;
	private String schEnd;
	private int schAllday;
	
	public String getId() {
	    return String.valueOf(schId);
	}

	public String getTitle() {
		// 이벤트의 제목으로 schContent 사용
	    return schContent; 
	}

	public boolean isAllDay() {
	    return schAllday == 1;
	}
	
}


