package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.LivingCategory;

@Mapper
public interface LivingCategoryDAO {

	List<LivingCategory> getAllCategoriesByFamily(int familyId);

	int addCategory(LivingCategory itemCategory);

	boolean exists(LivingCategory livingCategory);

	int checkCategoryDuplication(LivingCategory livingCategory);

	void updateCategoryName(@Param("originalName") String originalName, @Param("newName") String newName, @Param("familyId") int familyId);

	void deleteCategory(LivingCategory livingCategory);
}
