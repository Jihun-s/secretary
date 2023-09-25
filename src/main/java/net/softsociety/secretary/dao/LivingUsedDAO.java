package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.LivingUsed;

@Mapper
public interface LivingUsedDAO {

	void insertUsedItem(LivingUsed livingUsed);

	List<LivingUsed> getAllUsedItems();

}
