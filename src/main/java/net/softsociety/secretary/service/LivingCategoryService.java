package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.LivingCategory;

public interface LivingCategoryService {

	List<LivingCategory> getAllCategoriesByFamily(int familyId);

	int addCategory(LivingCategory itemCategory);

}
