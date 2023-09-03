package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 예산
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

	int budgetId;
	int cashbookId;
	int familyId;
	int budgetYear;
	int budgetMonth;
	int budgetAmount;
	
}
