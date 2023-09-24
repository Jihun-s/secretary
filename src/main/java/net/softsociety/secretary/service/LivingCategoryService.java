package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.LivingCategory;

public interface LivingCategoryService {

	List<LivingCategory> getAllCategoriesByFamily(int familyId);

	int addCategory(LivingCategory itemCategory);

	boolean checkCategoryDuplication(LivingCategory livingCategory);

	int countItemsUsingCategory(LivingCategory livingCategory);

	void updateCategory(String originalName, String newName, int familyId);

	void deleteCategory(String itemCategory, int familyId);

}
