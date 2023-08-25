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
public class Cashbook {

	int cashbookStatsId;
	int cashbookId;
	int familyId;
	int cashbookStatsYear;
	int cashbookStatsMonth;
	int cashbookStatsDate;
	int expendDaily;
	int budgetDaily;
	int expendMonthly;
	int incomeMonthly;
	int incomeYearly;
	int expendYearly;
	int assetYearly;
	
}
