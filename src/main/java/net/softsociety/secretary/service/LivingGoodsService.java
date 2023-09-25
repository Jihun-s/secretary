package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.LivingGoods;

public interface LivingGoodsService {

	void addLivingGood(LivingGoods livingGood, int familyId);

	List<LivingGoods> getLivingGoods();

	LivingGoods getGoodsDetails(int itemId);

	void modifyLivingGood(LivingGoods livingGoods, int familyId);

	void deleteLivingGoods(int itemId);

}
