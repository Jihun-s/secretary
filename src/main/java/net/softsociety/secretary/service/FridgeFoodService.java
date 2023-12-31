package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.FridgeFood;

public interface FridgeFoodService {
    void addFridgeFood(FridgeFood fridgeFood,int familyId);
    FridgeFood getFoodDetails(int foodId);
    List<FridgeFood> getAllFridgeFoods();
    public void modifyFridgeFood(FridgeFood fridgeFood, int familyId);
    public void deleteFridgeFood(int foodId);
	List<FridgeFood> getFoodsByFridgeId(int fridgeId);
	List<FridgeFood> getAllFoodsByCategory(String category);
	int getFoodCountByFridgeId(int fridgeId);
	List<FridgeFood> searchFoods(String query);
}