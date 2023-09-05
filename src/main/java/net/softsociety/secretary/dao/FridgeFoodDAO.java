package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.FridgeFood;

@Mapper
public interface FridgeFoodDAO {
    void insertFridgeFood(FridgeFood fridgeFood);
    FridgeFood getFoodDetails(int foodId);
    List<FridgeFood> getAllFridgeFoods();
}