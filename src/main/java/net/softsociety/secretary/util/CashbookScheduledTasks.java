package net.softsociety.secretary.util;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;


import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookAlertDAO;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.CashbookChart;
import net.softsociety.secretary.domain.User;

/** 가계부 스케줄링 작업 생성 클래스 */

@Slf4j
@Component // 빈으로 등록하기 위한 어노테이션 
public class CashbookScheduledTasks {
	
	@Autowired
	private CashbookDAO cashDao;
	
	@Autowired
	private CashbookAlertDAO alertDao;
	
	@Autowired
	private UserMapper userDao;
	
	// 매주 월요일 0시에 실행되는 스케줄링 작업
	@Scheduled(cron = "0 0 0 * * MON")
    public void weeklyTask() {
    	// 현재 날짜 가져오기
    	LocalDate now = LocalDate.now();
    	
    	// 모든 유저 데이터 가져오기
    	ArrayList<User> users = userDao.findALL();
    	log.debug("모든 유저 데이터:{}", users);
    	
    	// 각 유저에 대해 dao 실행
    	for (User user : users) {
            String userId = user.getUserId();
            int familyId = user.getFamilyId();

            HashMap<String, Object> map = new HashMap<>();
            map.put("userId", userId);
            map.put("familyId", familyId);
            map.put("curYear", now.getYear());
            map.put("curMonth", now.getMonthValue());
            map.put("alertType", "제안");
            
            
            // 남은 예산에 대한 알림 insertAlert()하기
            BigDecimal budgetRest = cashDao.getBudgetRest(map);
            // null인 경우 0으로 들어가게 하기 
            if (budgetRest == null) {
                budgetRest = BigDecimal.ZERO;
            }
            log.debug("{}번 가족 {}의 이번달 남은 예산:{}", familyId, userId, budgetRest);
            map.put("budgetRest", budgetRest);
            
            alertDao.insertJeahnBudgetAlert(map);
            
            
            // 주별 지출에 대한 알림 insertAlert()하기
            BigDecimal totalWeekExpense = cashDao.getTotalWeekExpense(map);
            // null인 경우 0으로 들어가게 하기
            if (totalWeekExpense == null) {
                totalWeekExpense = BigDecimal.ZERO;
            }
            log.debug("{}번 가족 {}의 지난주 총 지출:{}", familyId, userId, totalWeekExpense);
            map.put("totalWeekExpense", totalWeekExpense);
            
            alertDao.insertJeahnTWEAlert(map);
        }
    } // 매주 월요일 자정 Task
	
	// 매달 1일 자정에 실행되는 스케줄링 작업
	@Scheduled(cron = "0 0 0 1 * ?")
    public void monthlyTask() {
    	// 현재 날짜 가져오기
    	LocalDate now = LocalDate.now();
    	
    	// 모든 유저 데이터 가져오기
    	ArrayList<User> users = userDao.findALL();
    	log.debug("모든 유저 데이터:{}", users);
    	
    	// 각 유저에 대해 dao 실행
    	for (User user : users) {
            String userId = user.getUserId();
            int familyId = user.getFamilyId();

            HashMap<String, Object> map = new HashMap<>();
            map.put("userId", userId);
            map.put("familyId", familyId);
            map.put("curYear", now.getYear());
            map.put("curMonth", now.getMonthValue());
            map.put("alertType", "제안");
            
            
            // 남은 예산에 대한 알림 insertAlert()하기
            BigDecimal budgetRest = cashDao.getBudgetRest(map);
            // null인 경우 0으로 들어가게 하기 
            if (budgetRest == null) {
                budgetRest = BigDecimal.ZERO;
            }
            log.debug("{}번 가족 {}의 이번달 남은 예산:{}", familyId, userId, budgetRest);
            map.put("budgetRest", budgetRest);
            
            alertDao.insertJeahnBudgetAlert(map);
            
            
            // 지난 달 총 수입, 총 지출 
            BigDecimal totalIncomeMonth = cashDao.getTotalIncomeMonth(map);
            BigDecimal totalExpenseMonth = cashDao.getTotalExpenseMonth(map);
            // null인 경우 0으로 들어가게 하기
            if (totalIncomeMonth == null) {
            	totalIncomeMonth = BigDecimal.ZERO;
            }
            if (totalExpenseMonth == null) {
            	totalExpenseMonth = BigDecimal.ZERO;
            }
            log.debug("{}번 가족 {}의 지난달 총수입 총지출:{}&{}", familyId, userId, totalIncomeMonth, totalExpenseMonth);
            map.put("totalIncomeMonth", totalIncomeMonth);
            map.put("totalExpenseMonth", totalExpenseMonth);
            
            alertDao.insertJeahnTMIEAlert(map);
        }
    } // 매달 1일 자정 Task

}