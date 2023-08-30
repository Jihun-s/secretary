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

	private int transId;
	private int cashbookId;
	private String userId;
	private int familyId;
	private String transDate;
	private String transTime;
	private String transType;
	private String transCategory1;
	private String transCategory2;
	private String transPayee;
	private String transMemo;
	private long transAmount;
	private int cate1Custom;
	private int cate2Custom;
	
}
