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
	BigDecimal totalMonthExpense;
	
}
