package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.CalInEx;
import net.softsociety.secretary.domain.CashbookChart;
import net.softsociety.secretary.domain.Category1;
import net.softsociety.secretary.domain.Category2;
import net.softsociety.secretary.domain.Transaction;
import net.softsociety.secretary.domain.User;
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
	public void setTrans(Transaction trans
			, Model model) {
		log.debug("넘어온 거래내역:{}", trans);

		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		trans.setUserId(loginUser.getUserId());
		trans.setFamilyId(loginUser.getFamilyId());
		trans.setCashbookId(loginUser.getFamilyId());
		
		log.debug("입력할 거래내역:{}", trans);
		log.debug("입력할 cashbookId:{}", trans.getCashbookId());
		
		int n = service.insertTrans(trans);
		
	}
	
	/** 내역 목록 출력 */
	@GetMapping("list")
	public ArrayList<Transaction> list(int familyId
			, int nowYear
			, int nowMonth
			, Model model) {
 		HashMap<String, Object> map = new HashMap<>();
 		map.put("nowMonth", nowMonth);
 		map.put("nowYear", nowYear);
 		map.put("familyId", familyId);
		
		ArrayList<Transaction> result = dao.selectAllTrans(map);
		log.debug("출력할 내역목록:{}", result);
		
		return result;
	}
	
	/** 월간 내역 개수 출력 */
	@GetMapping("cntMonth")
	public int cntMonth(
			Model model
			, int nowMonth
			, int nowYear) {     
		User loginUser = (User) model.getAttribute("loginUser");
        
        HashMap<String, Object> map = new HashMap<>();
        map.put("nowYear", nowYear);
        map.put("nowMonth", nowMonth);
        map.put("familyId", loginUser.getFamilyId());
        log.debug("내역 개수 셀 때 쓰는 map:{}", map);
        
		int result = dao.selectTransCntMonth(map);
		log.debug("출력할 내역 개수:{}", result);
		
		return result;
	}
	
	/** 내역 수정 */
	@PostMapping("updateTrans")
	public void updateTrans(Transaction trans
			, Model model) {
		log.debug("컨트롤러에 넘어온 수정할 거래내역:{}", trans);
		
		User loginUser = (User) model.getAttribute("loginUser");
		trans.setUserId(loginUser.getUserId());
		trans.setFamilyId(loginUser.getFamilyId());
		
		log.debug("수정 들어갈 거래내역:{}", trans);
		
		int n = service.updateTrans(trans);
		
	}
	
	/** 내역 삭제 */
	@PostMapping("deleteTrans")
	public void deleteTrans(int transId, Model model) {
		log.debug("삭제할 거래번호:{}", transId);
		
		User loginUser = (User) model.getAttribute("loginUser");
		Transaction trans = new Transaction();
		trans.setFamilyId(loginUser.getFamilyId());
		trans.setUserId(loginUser.getUserId());
		trans.setTransId(transId);
		
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
	
	/** 한달 총 수입&지출 조회 */
	@GetMapping("selectSumInEx")
	public HashMap<String, Object> selectSumInEx(
			Model model
			, int nowYear
			, int nowMonth) {
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("familyId", loginUser.getFamilyId());
		map.put("nowYear", nowYear);
		map.put("nowMonth", nowMonth);
		log.debug("총수입지출 조회할 map:{}", map);
		
		HashMap<String, Object> result = dao.selectInExSumMonth(map);
		log.debug("총수입지출:{}", result);
		
		// 이번달 데이터 없음 
		if(result == null) {
		    log.error("{}년 {}월 데이터 없음", nowYear, nowMonth);
		    return new HashMap<>(); 
		}
		
		return result;
	}
	
	/** 조건별 보기 */
	@GetMapping("selectConditionTrans")
	public ArrayList<Transaction> selectConditionTrans(
			@AuthenticationPrincipal UserDetails user
			, boolean incomeSelected
			, boolean expenseSelected
			, boolean myTransOnly
			, String cate1Name
			, String cate2Name
			, String searchBy
			, String searchWord
			, String sortBy
			, int nowMonth
			, int nowYear
			, Model model
			) {
		log.debug("컨트롤러에 넘어온 내꺼만:{}, 수입만:{}, 지출만:{}", myTransOnly, incomeSelected, expenseSelected);
		log.debug("컨트롤러에 넘어온 대분류:{}, 소분류:{}", cate1Name, cate2Name);
		log.debug("컨트롤러에 넘어온 검색어:{} 중 {}", searchBy, searchWord);
		log.debug("컨트롤러에 넘어온 정렬: {}순", sortBy);
		
        log.debug("컨트롤러에 넘어온 검색할 기간:{}년 {}월", nowYear, nowMonth);

        // 유저id 불러오기
        String userId = userdao.findByEmailOrUserId(user.getUsername()).getUserId();
        User loginUser = (User) model.getAttribute("loginUser");
        
        // DAO에 보낼 맵 
		HashMap<String, Object> map = new HashMap<>();
		map.put("nowMonth", nowMonth);
		map.put("nowYear", nowYear);
		map.put("familyId", loginUser.getFamilyId());
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
	

	
	/** 달력 일별 수입 지출 총액 */
	@GetMapping("loadCalInEx")
	public ArrayList<CalInEx> loadCalInEx(
			int calYear
			, int calMonth
			, Model model) {
		log.debug("로드캘인엑스 컨트롤러 도착스");
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("calYear", calYear);
		map.put("calMonth", calMonth);
		log.debug("DAO에서 일별 수입지출액 뽑아올 map:{}", map);
		
		ArrayList<CalInEx> result = dao.loadCalInEx(map);
		log.debug("컨트롤러에 가져온 일별 수입지출액 목록:{}", result);
		
		return result;
	}
	
	/** 달력 상세 목록 */
	@GetMapping("getDetailList")
	public ArrayList<Transaction> getDetailList(
			Model model
			, int calYear
			, int calMonth
			, int calDate
			, String transType) {
		log.debug("{}년 {}월 {}일 {}유형 상세목록 불러오기", calYear, calMonth, calDate, transType);
		
		// DAO에 보낼 map 만들기
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("calYear", calYear);
		map.put("calMonth", calMonth);
		map.put("calDate", calDate);
		map.put("transType", transType);
		log.debug("DAO에서 일별 상세내역 뽑아올 map:{}", map);
		
		ArrayList<Transaction> result = dao.selectDetailTrans(map);
		log.debug("컨트롤러에 가져온 일별 {} 목록:{}", transType, result);
		
		return result;
	}
	
	/** 최다/최대 지출 소분류 카테고리 */
	@PostMapping("mostCate2")
	public ArrayList<CashbookChart> mostCate2(
			Model model
			, int nowYear
			, int nowMonth) {
		log.debug("{}년 {}월 최다최대소분류 컨트롤러 도착", nowYear, nowMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("nowYear", nowYear);
		map.put("nowMonth", nowMonth);
		log.debug("최다최대소분류 보낼 map:{}", map);
		
		ArrayList<CashbookChart> result = dao.getMostCate2(map);
		log.debug("최다최대소분류 결과:{}", map);

		return result;
	}
}
	