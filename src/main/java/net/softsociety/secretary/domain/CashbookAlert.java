package net.softsociety.secretary.domain;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 가계부 알림
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashbookAlert {

	int alertId;
	int familyId;
	int schId;
	String userId;
	String alertType;
	String alertTransType;
	String alertContent;
	String alertDate;
	String alertStart;
	String alertEnd;
	String alertDateYmd;
	String alertDateYear;
	String alertDateMonth;
	String alertDateDay;
	BigDecimal totalWeekExpense;
	BigDecimal totalIncomeMonth;
	BigDecimal totalExpenseMonth;
	BigDecimal budgetRest;
	
}
