package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.LivingGoods;

@Mapper
public interface LivingGoodsDAO {

	void insertLivingGood(LivingGoods livingGood);

	List<LivingGoods> getLivingGoods();

}
