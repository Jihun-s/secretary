package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.LivingCategory;

@Mapper
public interface LivingCategoryDAO {

	List<LivingCategory> getAllCategoriesByFamily(int familyId);

	int addCategory(LivingCategory itemCategory);

	boolean exists(LivingCategory livingCategory);
}
