package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category1 {
	
	int cate1Id;
	String cate1Name;
	int isCustom;
	String transType;
	int familyId;
	String userId;
	
}
