package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Category1;
import net.softsociety.secretary.domain.Category2;
import net.softsociety.secretary.domain.Transaction;
import net.softsociety.secretary.service.CashbookService;

@Slf4j
@RequestMapping("/cashbook/trans")
@RestController
public class CashbookTransRestController {
	
	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;
	
	
	/** 내역 입력 */
	@PostMapping("setTrans")
	public void setTrans(Transaction trans, @AuthenticationPrincipal UserDetails user) {
		log.debug("넘어온 거래내역:{}", trans);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		
		// cashbookId, familyId 임의로 입력
		trans.setCashbookId(1);
		trans.setFamilyId(1);
		log.debug("입력할 거래내역:{}", trans);
		log.debug("입력할 cashbookId:{}", trans.getCashbookId());
		
		int n = service.insertTrans(trans);
		
	}
	
	/** 내역 목록 출력 */
	@GetMapping("list")
	public ArrayList<Transaction> list(int familyId) {
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int month = calendar.get(Calendar.MONTH) + 1;
        
        // DAO에 보낼 맵 
 		HashMap<String, Object> map = new HashMap<>();
 		map.put("month", month);
 		map.put("familyId", familyId);
		
		ArrayList<Transaction> result = dao.selectAllTrans(map);
		log.debug("출력할 내역목록:{}", result);
		
		return result;
	}
	
	/** 월간 내역 개수 출력 */
	@GetMapping("cntMonth")
	public int cntMonth() {
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int curMonth = calendar.get(Calendar.MONTH) + 1;
        
        // 가족ID 임의 입력
        int familyId = 1;
        
        HashMap<String, Object> map = new HashMap<>();
        map.put("curMonth", curMonth);
        map.put("familyId", familyId);
        log.debug("내역 개수 셀 때 쓰는 map:{}", map);
        
		int result = dao.selectTransCntMonth(map);
		log.debug("출력할 내역 개수:{}", result);
		
		return result;
	}
	
	/** 내역 수정 */
	@PostMapping("updateTrans")
	public void updateTrans(Transaction trans, @AuthenticationPrincipal UserDetails user) {
		log.debug("컨트롤러에 넘어온 수정할 거래내역:{}", trans);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		log.debug("수정 들어갈 거래내역:{}", trans);
		
		int n = service.updateTrans(trans);
		
	}
	
	/** 내역 삭제 */
	@PostMapping("deleteTrans")
	public void deleteTrans(int transId, @AuthenticationPrincipal UserDetails user) {
		log.debug("삭제할 거래번호:{}", transId);
		
		Transaction trans = new Transaction();
		trans.setTransId(transId);
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		trans.setUserId(userId);
		log.debug("삭제할 거래내역:{}", trans);
		
		int n = service.deleteTrans(trans);
		
	}
	
	/** 대분류 불러오기 */
	@GetMapping("loadCate1")
	public ArrayList<Category1> loadCate1(String transType) {
		log.debug("넘어온 거래 유형:{}", transType);
		
		ArrayList<Category1> result = dao.selectCate1(transType);
		log.debug("출력할 대분류:{}", result);
		
		return result;
	}
	
	/** 검색 대분류 불러오기 */
	@GetMapping("loadCate1Search")
	public ArrayList<Category1> loadCate1Search() {
		
		ArrayList<Category1> result = dao.selectCate1Search();
		log.debug("출력할 검색용 대분류:{}", result);
		
		return result;
	}
	
	/** 소분류 불러오기 */
	@GetMapping("loadCate2")
	public ArrayList<Category2> loadCate2(String cate1Name) {
		log.debug("넘어온 대분류:{}", cate1Name);
		
		ArrayList<Category2> result = dao.selectCate2(cate1Name);
		log.debug("출력할 소분류:{}", result);
		
		return result;
	}
	
	/** 커스텀 대분류 추가하기 */
	@PostMapping("addCate1")
	public void addCate1(Category1 cate1, @AuthenticationPrincipal UserDetails user) {
		log.debug("넘어온 커스텀 대분류:{}", cate1);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		cate1.setUserId(userId);
		log.debug("입력할 커스텀 대분류:{}", cate1);
		
		int n = service.addCustomCate1(cate1);
	}

	/** 커스텀 소분류 추가하기 */
	@PostMapping("addCate2")
	public void addCate2(Category2 cate2, String cate1Name, @AuthenticationPrincipal UserDetails user) {
		log.debug("넘어온 커스텀 소분류:{}, 대분류:{}", cate2, cate1Name);
		
		// 유저id 불러오기
		String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
		// 유저id 입력 
		cate2.setUserId(userId);
		log.debug("입력할 커스텀 소분류:{}", cate2);
		
		int n = service.addCustomCate2(cate2, cate1Name);
	}
	
	/** 거래내역 하나 조회 */
	@PostMapping("selectTrans")
	public Transaction setTrans(int transId) {
		log.debug("컨트롤러에 넘어온 transId:{}", transId);
		
		Transaction result = dao.selectTrans(transId);
		log.debug("모달에 뿌리려고 불러온 거래내역:{}", result);
		
		return result;
	}
	
//	/** 한달 총 수입&지출 조회 */
//	@GetMapping("selectSumInEx")
//	public HashMap<String, Object> selectSumInEx() {
//		// 현재 월 구하기
//		Calendar calendar = Calendar.getInstance();
//        int curMonth = calendar.get(Calendar.MONTH) + 1;
//		
//		HashMap<String, Object> result = new HashMap<>();
//		
//		// 한달 수입
//		int sumIncomeMonth = dao.selectSumIncomeMonth(map);
//		result.put("sumIncomeMonth", sumIncomeMonth);
//		log.debug("컨트롤러가 가져온 {}월 총 수입:{}", curMonth, sumIncomeMonth);
//		// 한달 지출
//		int sumExpenseMonth = dao.selectSumExpenseMonth(curMonth);
//		result.put("sumExpenseMonth", sumExpenseMonth);
//		log.debug("컨트롤러가 가져온 {}월 총 수입:{}", curMonth, sumExpenseMonth);
//		
//		return result;
//	}
	
	/** 조건별 보기 */
	@GetMapping("selectConditionTrans")
	public ArrayList<Transaction> selectConditionTrans(
			@AuthenticationPrincipal UserDetails user
			, boolean incomeSelected
			, boolean expenseSelected
			, boolean myTransOnly
			, int familyId
			, String cate1Name
			, String cate2Name
			, String searchBy
			, String searchWord
			, String sortBy
			) {
		log.debug("컨트롤러에 넘어온 내꺼만:{}, 수입만:{}, 지출만:{}", myTransOnly, incomeSelected, expenseSelected);
		log.debug("컨트롤러에 넘어온 대분류:{}, 소분류:{}", cate1Name, cate2Name);
		log.debug("컨트롤러에 넘어온 검색어:{} 중 {}", searchBy, searchWord);
		log.debug("컨트롤러에 넘어온 정렬: {}순", sortBy);
		
		// 현재 월 구하기
		Calendar calendar = Calendar.getInstance();
        int month = calendar.get(Calendar.MONTH) + 1;
		
        log.debug("컨트롤러에 넘어온 검색할 기간:{}월", month);

        // 유저id 불러오기
        String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();

        // DAO에 보낼 맵 
		HashMap<String, Object> map = new HashMap<>();
		map.put("month", month);
		map.put("familyId", familyId);
		map.put("myTransOnly", myTransOnly);
		map.put("incomeSelected", incomeSelected);
		map.put("expenseSelected", expenseSelected);
		map.put("userId", userId);
		map.put("sortBy", sortBy);
		
		if(cate1Name.length() > 0) {
			map.put("cate1Name", cate1Name);
		}
		if(searchWord.length() > 0) {
			map.put("searchBy", searchBy);
			map.put("searchWord", searchWord);
		}
		
		ArrayList<Transaction> result = new ArrayList<>();
		
		if(!incomeSelected && !expenseSelected) {
			result.clear();
		}
		else {
			log.debug("뽑아올 내역 조건:{}", map);
			result = dao.selectAllTrans(map);
			log.debug("조건 결과 내역목록:{}", result);
		}
		
		return result;
	}
	
	
	
}
	