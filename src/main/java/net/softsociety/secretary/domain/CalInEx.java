package net.softsociety.secretary.domain;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 거래내역 달력 표시에 쓰이는 도메인 
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalInEx {

	private String calDate;
	private BigDecimal calIncome;
	private BigDecimal calExpense;
	
}
