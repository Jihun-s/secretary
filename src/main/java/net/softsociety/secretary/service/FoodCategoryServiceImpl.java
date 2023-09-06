package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.FoodCategoryDAO;
import net.softsociety.secretary.domain.FoodCategory;

@Service
public class FoodCategoryServiceImpl implements FoodCategoryService {
    @Autowired
    private FoodCategoryDAO foodCategoryDAO;

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
}
