package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.LivingGoods;

public interface LivingGoodsService {

	void addLivingGood(LivingGoods livingGood, int familyId);

	List<LivingGoods> getLivingGoods();

}
