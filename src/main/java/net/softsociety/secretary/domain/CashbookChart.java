package net.softsociety.secretary.domain;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 가계부 통계분석 VO
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashbookChart {

	int familyId;
	String userId;
	String cate1Name;
	String cate2Name;
	String labelColor;
	
	int chYear;
	int chMonth;
	int curYear;
	int curMonth;
	int weekOfMonth;
	int cate1Id;
	int cate2Id;
	int budgetSuccess;
	int inExSuccess;
	int transCount;
	
	BigDecimal totalAmount;
	BigDecimal totalMonthExpense;
	BigDecimal totalMonthIncome;
	BigDecimal totalMonthExpenseAvg;
	BigDecimal totalMonthIncomeAvg;
	BigDecimal totalWeekExpense;
	BigDecimal weekAccumulatedExpense;
	BigDecimal budgetAmount;
	BigDecimal budgetVsExpense;
	BigDecimal incomeVsExpense;
}
