package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Closet {
	private int closetNum;
	private int familyId;
	private String userId;
	private String closetName;	
}
