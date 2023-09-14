package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.FridgeUsed;

@Mapper
public interface FridgeUsedDAO {
	void insertUsedFood(FridgeUsed fridgeUsed);

	List<FridgeUsed> getAllUsedFoods();
}
