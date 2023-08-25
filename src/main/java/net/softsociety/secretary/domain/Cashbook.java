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

	private int cashbookStatsId;
	private int cashbookId;
	private int familyId;
	private int cashbookStatsYear;
	private int cashbookStatsMonth;
	private int cashbookStatsDate;
	private int expendDaily;
	private int budgetDaily;
	private int expendMonthly;
	private int incomeMonthly;
	private int incomeYearly;
	private int expendYearly;
	private int assetYearly;
	
}
