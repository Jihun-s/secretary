package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.FridgeFoodDAO;
import net.softsociety.secretary.dao.FridgeUsedDAO;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeUsed;

@Slf4j
@Service
public class FridgeUsedServiceImpl implements FridgeUsedService {
	
	@Autowired
	private FridgeUsedDAO fridgeUsedDAO;
	
	@Autowired
    private FridgeFoodDAO fridgeFoodDAO;
	
	@Override
	@Transactional
	public void consumeFood(FridgeFood fridgeFood) {
	    // 수량 확인
	    int currentQuantity = fridgeFoodDAO.checkFoodQuantity(fridgeFood);
	    
	    // 현재 수량이 소비하려는 수량보다 많거나 같다면
	    if (currentQuantity >= fridgeFood.getFoodQuantity()) {
	        // 수량 감소
	        fridgeFoodDAO.reduceFoodQuantity(fridgeFood);
	        
	        // 소비 이력 추가
	        FridgeUsed fridgeUsed = new FridgeUsed();
	        fridgeUsed.setFoodId(fridgeFood.getFoodId());
	        fridgeUsed.setFridgeQuantityUsed(fridgeFood.getFoodQuantity());
	        fridgeUsed.setFridgeId(fridgeFood.getFridgeId());
	        fridgeUsed.setFridgeFoodName(fridgeFood.getFoodName());
	        
	        try {
	            fridgeUsedDAO.insertUsedFood(fridgeUsed);
	        } catch (Exception e) {
	            log.error("Error inserting used food", e);
	        }

	        // 수량이 0이면 음식 삭제
	        if (currentQuantity - fridgeFood.getFoodQuantity() == 0) {
	            fridgeFoodDAO.deleteFridgeFood(fridgeFood.getFoodId());
	        }
	    } else {
	        // 오류 처리 (예: 예외 발생)
	    }
	}

	@Override
	public List<FridgeUsed> getUsedFoodsHistory() {
		return fridgeUsedDAO.getAllUsedFoods();
	}

	@Override
	public List<FridgeFood> getFoodsNotAccessedForDays(int days) {
		return fridgeUsedDAO.getFoodsNotAccessedForDays(days);
	}

	@Override
	public int deleteById(int fridgeUsedId) {
		return fridgeUsedDAO.deleteById(fridgeUsedId);
	}

	@Override
	public void deleteAll(int familyId) {
		fridgeUsedDAO.deleteAll(familyId);
	}
	

}
