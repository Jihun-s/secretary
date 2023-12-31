package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClosetStyleDiary {
	int styleNum;
	private String userId;
	String styleDescription;
	String styleTPO;
	String styleSeasons;
	String styleInfo;
	String styleImg;
}
