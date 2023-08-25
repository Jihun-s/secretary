package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * 거래내역
 * */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

	int transId;
	int cashbookId;
	int userId;
	int familyId;
	String transDate;
	String transType;
	String transCategory1;
	String transCategory2;
	String transPayee;
	String transMemo;
	long transAmount;
	
}
