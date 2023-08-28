package net.softsociety.secretary.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Closet;

@Mapper
public interface ClosetDAO {

	int insertCloset(Closet closet);

	ArrayList<Closet> findAllCloset();

}
