package net.softsociety.secretary.dao;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Closet;

@Mapper
public interface ClosetDAO {

	int insertCloset(Closet closet);

}
