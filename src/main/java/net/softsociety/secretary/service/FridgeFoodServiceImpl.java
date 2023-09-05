package net.softsociety.secretary.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.FridgeFoodDAO;
import net.softsociety.secretary.domain.FridgeFood;

@Service
public class FridgeFoodServiceImpl implements FridgeFoodService {

    @Autowired
    private FridgeFoodDAO fridgeFoodDAO;

    @Override
    public void addFridgeFood(FridgeFood fridgeFood) {
        
        // foodMadeDate의 경우 null을 그대로 유지하므로 별도의 처리가 필요하지 않습니다.

    	System.out.println("Before setting expiry date: " + fridgeFood.getFoodExpiryDate());
    	
    	if (fridgeFood.getFoodExpiryDate() == null || fridgeFood.getFoodExpiryDate().trim().isEmpty()) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, 14); // 현재 날짜에 14일을 추가
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDate = dateFormat.format(calendar.getTime());
            fridgeFood.setFoodExpiryDate(formattedDate);
        }

        // foodPrice는 null이 허용되므로 별도의 처리가 필요하지 않습니다.

        System.out.println("After setting expiry date: " + fridgeFood.getFoodExpiryDate());
        
        fridgeFoodDAO.insertFridgeFood(fridgeFood);
    }
    
    //음식 한개
    @Override
    public FridgeFood getFoodDetails(int foodId) {
        return fridgeFoodDAO.getFoodDetails(foodId);
    }
    
    //음식 전체 가져오기
    @Override
    public List<FridgeFood> getAllFridgeFoods() {
        return fridgeFoodDAO.getAllFridgeFoods();
    }

}