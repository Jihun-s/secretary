package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.FoodCategory;

@Mapper
public interface FoodCategoryDAO {

	public int addCategory(FoodCategory foodCategory);

	public List<FoodCategory> getAllCategoriesByFamily(int familyId);

	boolean exists(FoodCategory foodCategory);

	void updateCategoryName(@Param("originalName") String originalName, @Param("newName") String newName, @Param("familyId") int familyId);

	int checkCategoryDuplication(FoodCategory foodCategory);

	void deleteCategoryName(FoodCategory foodCategory);
}
