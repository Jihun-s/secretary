package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 가계부
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashbookStats {

	private int cashbookId;
	private int familyId;
	private String userId;
	
}
