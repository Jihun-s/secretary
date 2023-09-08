package net.softsociety.secretary.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.FoodCategoryDAO;
import net.softsociety.secretary.dao.FridgeFoodDAO;
import net.softsociety.secretary.domain.FoodCategory;
import net.softsociety.secretary.domain.FridgeFood;

@Slf4j
@Service
public class FridgeFoodServiceImpl implements FridgeFoodService {

    @Autowired
    private FridgeFoodDAO fridgeFoodDAO;
    @Autowired
    private FoodCategoryDAO foodCategoryDAO; // 카테고리 테이블과 관련된 DAO
    @Autowired
    private UserService userService; // UserService 주입

    @Override
    public void addFridgeFood(FridgeFood fridgeFood, int familyId) {
    	
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
        
     // 2. 카테고리가 이미 존재하는지 확인
        String category = fridgeFood.getFoodCategory();
        FoodCategory foodCategory = new FoodCategory();
        foodCategory.setFoodCategory(category);
        foodCategory.setFamilyId(familyId);
        if (!foodCategoryDAO.exists(foodCategory)) {
            // 3. 카테고리가 존재하지 않으면 새로운 카테고리 추가
            foodCategoryDAO.addCategory(foodCategory);
        }
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

    @Override
    public void modifyFridgeFood(FridgeFood fridgeFood, int familyId) {
        // 유통기한 설정 로직
        if (fridgeFood.getFoodExpiryDate() == null || fridgeFood.getFoodExpiryDate().trim().isEmpty()) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, 14);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDate = dateFormat.format(calendar.getTime());
            fridgeFood.setFoodExpiryDate(formattedDate);
        }

        // 카테고리 존재 여부 확인 및 추가 로직
        String category = fridgeFood.getFoodCategory();
        FoodCategory foodCategory = new FoodCategory();
        foodCategory.setFoodCategory(category);
        foodCategory.setFamilyId(familyId);
        if (!foodCategoryDAO.exists(foodCategory)) {
            foodCategoryDAO.addCategory(foodCategory);
        }

        fridgeFoodDAO.modifyFridgeFood(fridgeFood);
    }

	@Override
	public void deleteFridgeFood(int foodId) {
		fridgeFoodDAO.deleteFridgeFood(foodId);
	}

}