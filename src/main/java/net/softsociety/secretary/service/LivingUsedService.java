package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.LivingGoods;
import net.softsociety.secretary.domain.LivingUsed;

public interface LivingUsedService {

	void consumeItem(LivingGoods livingGoods);

	List<LivingUsed> getUsedGoodsHistory();

}
