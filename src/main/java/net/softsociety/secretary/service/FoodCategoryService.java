package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.FoodCategory;

public interface FoodCategoryService {
    int addCategory(FoodCategory foodCategory);
    List<FoodCategory> getAllCategoriesByFamily(int familyId);
    boolean exists(FoodCategory foodCategory);
}
