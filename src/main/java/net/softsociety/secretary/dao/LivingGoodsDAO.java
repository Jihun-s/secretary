package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.LivingCategory;
import net.softsociety.secretary.domain.LivingGoods;

@Mapper
public interface LivingGoodsDAO {

	void insertLivingGood(LivingGoods livingGood);

	List<LivingGoods> getLivingGoods();

	LivingGoods getGoodsDetails(int itemId);

	int countItemsUsingCategory(LivingCategory livingCategory);

	void updateItemsCategoryName(@Param("originalName") String originalName, @Param("newName") String newName, @Param("familyId") int familyId);

	void modifyLivingGood(LivingGoods livingGood);

	void deleteLivingGoods(int itemId);

	int checkItemQuantity(LivingGoods livingGoods);

	void reduceItemQuantity(LivingGoods livingGoods);

	List<LivingGoods> searchLivingGoods(String query);

}
