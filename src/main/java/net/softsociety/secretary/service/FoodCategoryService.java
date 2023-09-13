package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.FoodCategory;

public interface FoodCategoryService {
    int addCategory(FoodCategory foodCategory);
    List<FoodCategory> getAllCategoriesByFamily(int familyId);
    boolean exists(FoodCategory foodCategory);
    void updateCategory(String originalName, String newName, int familyId);
    boolean checkCategoryDuplication(FoodCategory foodCategory);
    int countFoodsUsingCategory(FoodCategory foodCategory);
    void deleteCategory(String foodCategory, int familyId);
}
