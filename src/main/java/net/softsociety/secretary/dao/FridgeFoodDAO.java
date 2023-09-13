package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.FoodCategory;
import net.softsociety.secretary.domain.FridgeFood;

@Mapper
public interface FridgeFoodDAO {
    void insertFridgeFood(FridgeFood fridgeFood);
    FridgeFood getFoodDetails(int foodId);
    List<FridgeFood> getAllFridgeFoods();
    public int modifyFridgeFood(FridgeFood fridgeFood);
    public int deleteFridgeFood(int foodId);
	List<FridgeFood> getFoodsByFridgeId(int fridgeId);
	List<FridgeFood> getAllFoodsByCategory(String category);
	int getFoodCountByFridgeId(int fridgeId);
	void updateFoodsCategoryName(@Param("originalName") String originalName, @Param("newName") String newName, @Param("familyId") int familyId);
	int countFoodsUsingCategory(FoodCategory foodCategory);
}