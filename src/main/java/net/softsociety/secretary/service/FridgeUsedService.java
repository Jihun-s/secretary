package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeUsed;

public interface FridgeUsedService {
	void consumeFood(FridgeFood fridgeFood);

	List<FridgeUsed> getUsedFoodsHistory();
}
