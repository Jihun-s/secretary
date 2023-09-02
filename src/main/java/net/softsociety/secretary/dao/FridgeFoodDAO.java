package net.softsociety.secretary.dao;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.FridgeFood;

@Mapper
public interface FridgeFoodDAO {
    void insertFridgeFood(FridgeFood fridgeFood);
}