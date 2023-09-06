package net.softsociety.secretary.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;

@Mapper
public interface ClosetDAO {
	//옷장추가
	int insertCloset(Closet closet);

	//옷장리스트 출력
	ArrayList<Closet> findAllCloset();

	//옷장에 옷 추가
	void insertClothes(Clothes clothes);

	//옷장에 의류목록 출력
	ArrayList<Clothes> findAllClothes(HashMap<String, Object> map);
	//옷장 옷 찾기
	Clothes findClothes(HashMap<String, Integer> map);
	//옷장 옷 삭제
	int deleteClothes(HashMap<String, Integer> map);
	//옷장 옷 수정
	int updateClothes(Clothes clothes);

}
