package net.softsociety.secretary.dao;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Board;

@Mapper
public interface BoardDAO {

	int write(Board b);

}
