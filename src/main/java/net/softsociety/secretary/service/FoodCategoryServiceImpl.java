package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.FoodCategoryDAO;
import net.softsociety.secretary.dao.FridgeFoodDAO;
import net.softsociety.secretary.domain.FoodCategory;

@Slf4j
@Service
public class FoodCategoryServiceImpl implements FoodCategoryService {
    @Autowired
    private FoodCategoryDAO foodCategoryDAO;
    
    @Autowired
    private FridgeFoodDAO fridgeFoodDAO;

    @Override
    public int addCategory(FoodCategory foodCategory) {
        return foodCategoryDAO.addCategory(foodCategory);
    }

    @Override
    public List<FoodCategory> getAllCategoriesByFamily(int familyId) {
        return foodCategoryDAO.getAllCategoriesByFamily(familyId);
    }

	@Override
	public boolean exists(FoodCategory foodCategory) {
		return foodCategoryDAO.exists(foodCategory);
	}

	@Override
	@Transactional
	public void updateCategory(String originalName, String newName, int familyId) {
	    foodCategoryDAO.updateCategoryName(originalName, newName, familyId);
	    fridgeFoodDAO.updateFoodsCategoryName(originalName, newName, familyId);
	}
	
	@Override
    public boolean checkCategoryDuplication(FoodCategory foodCategory) {
        return foodCategoryDAO.checkCategoryDuplication(foodCategory) > 0;
    }

    @Override
    public int countFoodsUsingCategory(FoodCategory foodCategory) {
    	int count = fridgeFoodDAO.countFoodsUsingCategory(foodCategory);
        return fridgeFoodDAO.countFoodsUsingCategory(foodCategory);
    }
    
    @Override
    @Transactional
    public void deleteCategory(String foodCategory, int familyId) {
        // 음식 카테고리를 '일반'으로 변경
        fridgeFoodDAO.updateFoodsCategoryName(foodCategory, "일반", familyId);

        FoodCategory foodCategoryVo = new FoodCategory();
        foodCategoryVo.setFamilyId(familyId);
        foodCategoryVo.setFoodCategory(foodCategory);
        // 카테고리 삭제
        foodCategoryDAO.deleteCategoryName(foodCategoryVo);
    }
}
