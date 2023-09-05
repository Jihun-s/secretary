package net.softsociety.secretary.service;

import java.util.ArrayList;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;

public interface ClosetService {

	int insertCloset(Closet closet);
	
	//옷장정보 불러오기
	ArrayList<Closet> findAllCloset();
	
	//옷장에 의류등록
	void insertClothes(Clothes clothes);

	// 옷장에 의류목록 출력 & 검색
	ArrayList<Clothes> findAllClothes(int closetNum, String category, String size, String material, String[] seasonArr);
	
	// 옷장안 옷찾기
	Clothes findClothes(int closetNum, int clothesNum);
	
}
