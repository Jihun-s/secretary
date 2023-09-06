package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.FoodCategory;

@Mapper
public interface FoodCategoryDAO {

	public int addCategory(FoodCategory foodCategory);

	public List<FoodCategory> getAllCategoriesByFamily(int familyId);

	boolean exists(FoodCategory foodCategory);
}
