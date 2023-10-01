package net.softsociety.secretary.domain;

import java.math.BigDecimal;

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
	BigDecimal budgetAmount;
	
}
