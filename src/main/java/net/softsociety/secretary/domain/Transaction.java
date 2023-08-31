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
	private int cate1Id;
	private int cate2Id;
	private String cate1Name;
	private String cate2Name;
	private String transPayee;
	private String transMemo;
	private long transAmount;
	private String labelColor;
	
}
