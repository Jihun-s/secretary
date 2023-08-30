package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category2 {
	
	int cate2Id;
	int cate1Id;
	String cate2Name;
	int isCustom;
	int familyId;
	String userId;
	
}
