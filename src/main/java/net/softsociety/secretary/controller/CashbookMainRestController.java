package net.softsociety.secretary.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.ScheduleDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.Budget;
import net.softsociety.secretary.domain.CashbookChart;
import net.softsociety.secretary.domain.Schedule;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookService;
import net.softsociety.secretary.service.ScheduleService;

/** 
 * 메인화면 RestController
 * */

@Slf4j
@RestController
@RequestMapping("cashbook")
public class CashbookMainRestController {

	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;
	
	@Autowired
	ScheduleService schService;
	
	@Autowired
	ScheduleDAO schDao;
	
	
	@PostMapping("init")
	public HashMap<String, Object> init(
			String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			, Model model) {
		log.debug("컨트롤러에 넘어온 curDateTime:{}, curYear:{}, curMonth:{}, curDate:{}", curDateTime, curYear, curMonth, curDate);

		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> result = new HashMap<>();		
		
		// dao에 보낼 매개변수 now용 map 만들기 
		HashMap<String, Object> map2 = new HashMap<>();
		map2.put("nowYear", curYear);
		map2.put("nowMonth", curMonth);
		map2.put("familyId", loginUser.getFamilyId());
		log.debug("DAO에 보낼 map2:{}", map2);		
		
		// 수입 지출 총합 
		HashMap<String, Object> sum = dao.selectInExSumMonth(map2);
		
		// incomeSumMonth가 null이면 BigDecimal.ZERO로 설정
		BigDecimal incomeSumMonth = (sum != null && sum.get("INCOMESUMMONTH") != null) 
		                           ? (BigDecimal) sum.get("INCOMESUMMONTH")
		                           : BigDecimal.ZERO;

		// expenseSumMonth가 null이면 BigDecimal.ZERO로 설정
		BigDecimal expenseSumMonth = (sum != null && sum.get("EXPENSESUMMONTH") != null) 
		                            ? (BigDecimal) sum.get("EXPENSESUMMONTH")
		                            : BigDecimal.ZERO;

		log.debug("총합 가져오기:{}", sum);
		log.debug("{}년 {}월 총수입{} 총지출{}", curYear, curMonth, incomeSumMonth, expenseSumMonth);
		result.put("incomeSumMonth", incomeSumMonth);
		result.put("expenseSumMonth", expenseSumMonth);		

		
		// dao에 보낼 매개변수 budget용 map 만들기 
		HashMap<String, Object> map = new HashMap<>();
		map.put("budgetYear", curYear);
		map.put("budgetMonth", curMonth);
		map.put("familyId", loginUser.getFamilyId());
		log.debug("DAO에 보낼 map:{}", map);
		
		// 예산 존재 여부
		int budgetExist = (dao.budgetExist(map) != 0) ? dao.budgetExist(map) : 0;
		log.debug("예산 있나요?:{}", budgetExist);
		result.put("budgetExist", budgetExist);
		
		if(budgetExist == 1) {
		    Budget budget = dao.selectBudget(map);
		    BigDecimal budgetAmount = (budget != null && budget.getBudgetAmount() != null) 
                    ? budget.getBudgetAmount()
                    : BigDecimal.ZERO;
		    BigDecimal remainingAmount = budgetAmount.subtract(expenseSumMonth);

		    result.put("remainingAmount", remainingAmount);
		    result.put("budgetAmount", budgetAmount);
		}
		
		return result;
	}

	/** 예산 설정 모달 init */
	@PostMapping("initSetBudgetModal")
	public HashMap<String, Object> initSetBudgetModal(
			String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			, Model model) {
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> result = new HashMap<>();	
		
		// dao에 보낼 매개변수 map 만들기 
		HashMap<String, Object> map = new HashMap<>();
		map.put("budgetYear", curYear);
		map.put("budgetMonth", curMonth);
		map.put("familyId", loginUser.getFamilyId());
		log.debug("DAO에 보낼 map:{}", map);
		
		int budgetExist = dao.budgetExist(map);
		
		if(budgetExist == 0) {
			HashMap<String, Object> bax = dao.selectBudgetAvgXXX(map);
			BigDecimal budgetAvg = (BigDecimal) bax.get("BUDGETAVG");
			BigDecimal budgetAmountX = (BigDecimal) bax.get("BUDGETAMOUNTX");
			BigDecimal budgetAmountXx = (BigDecimal) bax.get("BUDGETAMOUNTXX");
			BigDecimal budgetAmountXxx = (BigDecimal) bax.get("BUDGETAMOUNTXXX");
				
			log.debug("직전 3개월 예산 평균?:{}", budgetAvg);
			log.debug("직전 3개월 예산:{}->{}->{}", budgetAmountX, budgetAmountXx, budgetAmountXxx);

			result.put("budgetAvg", budgetAvg);
			result.put("budgetAmountX", budgetAmountX);
			result.put("budgetAmountXx", budgetAmountXx);
			result.put("budgetAmountXxx", budgetAmountXxx);

			return result;
		}
		else {
			return result;
		}
	}


	/** 예산 수정 모달 init */
	@PostMapping("initUpdateBudgetModal")
	public HashMap<String, Object> initUpdateBudgetModal(
			String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			, Model model) {
		log.debug("예산 수정할때 쓰는 이닛!!!!!!!!!!!!!");
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> result = new HashMap<>();	
		
		// dao에 보낼 매개변수 map 만들기 
		HashMap<String, Object> map = new HashMap<>();
		map.put("budgetYear", curYear);
		map.put("budgetMonth", curMonth);
		map.put("familyId", loginUser.getFamilyId());
		log.debug("DAO에 보낼 map:{}", map);
		
		int budgetExist = dao.budgetExist(map);
		
		if(budgetExist == 1) {
			HashMap<String, Object> bax = dao.selectBudgetAvgXXX(map);
			BigDecimal budgetAvg = (BigDecimal) bax.get("BUDGETAVG");
			BigDecimal budgetAmountX = (BigDecimal) bax.get("BUDGETAMOUNTX");
			BigDecimal budgetAmountXx = (BigDecimal) bax.get("BUDGETAMOUNTXX");
			BigDecimal budgetAmountXxx = (BigDecimal) bax.get("BUDGETAMOUNTXXX");
				
			log.debug("직전 3개월 예산 평균?:{}", budgetAvg);
			log.debug("직전 3개월 예산:{}->{}->{}", budgetAmountX, budgetAmountXx, budgetAmountXxx);

			result.put("budgetAvg", budgetAvg);
			result.put("budgetAmountX", budgetAmountX);
			result.put("budgetAmountXx", budgetAmountXx);
			result.put("budgetAmountXxx", budgetAmountXxx);

			return result;
		}
		else {
			return result;
		}
	}
	
	/** 알림 목록 가져오기 */ 
	@PostMapping("alertList")
	public ArrayList<Schedule> alertList(
			Model model
			, String curDateTime
			, int curYear
			, int curMonth
			, int curDate
			) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		map.put("curDateTime", curDateTime);
		map.put("curYear", curYear);
		map.put("curMonth", curMonth);
		map.put("curDate", curDate);
		log.debug("{}번 가족 {}의 {} 기준 알림 가져오기", familyId, userId, curDateTime);

		ArrayList<Schedule> result = schService.alertList(map);
		log.debug("화면에 출력할 필수알림 리스트:{}", result);
		log.debug("화면에 출력할 필수알림 리스트 개수:{}", result.size());
		
		return result;
	}
	
	/** 예산 존재 확인하기 */
	@GetMapping("budgetExist")
	public int budgetExist(Model model
			, int curYear
			, int curMonth) {
		User loginUser = (User) model.getAttribute("loginUser");
		int familyId = loginUser.getFamilyId();
		String userId = loginUser.getUserId();
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("familyId", familyId);
		map.put("budgetYear", curYear);
		map.put("budgetMonth", curMonth);
		
		int result = dao.budgetExist(map);
		log.debug("{}월 예산 있없? : {}", curMonth, result);
		
		return result;
	}
	
	/** 이번달 저번달 수입/지출 */
	@PostMapping("curPreInExSum")
	public ArrayList<CashbookChart> curPreInExSum(
			Model model
			, int chYear
			, int chMonth) {
		log.debug("{}년 {}월 이전월 비교 컨트롤러 도착", chYear, chMonth);
		User loginUser = (User) model.getAttribute("loginUser");
		HashMap<String, Object> map = new HashMap<>();
		map.put("userId", loginUser.getUserId());
		map.put("familyId", loginUser.getFamilyId());
		map.put("chYear", chYear);
		map.put("chMonth", chMonth);
		log.debug("이전월 비교 보낼 map:{}", map);
		
	    ArrayList<CashbookChart> result = dao.getCurPreInExSum(map);
	    
	    // null을 0으로 변환
	    for (CashbookChart chart : result) {
	        if (chart.getTotalMonthExpense() == null) {
	            chart.setTotalMonthExpense(BigDecimal.ZERO);
	        }
	        if (chart.getTotalMonthIncome() == null) {
	            chart.setTotalMonthIncome(BigDecimal.ZERO);
	        }
	    }

	    log.debug("이전월 비교 결과:{}", result);
	    return result;
	
	}
}
