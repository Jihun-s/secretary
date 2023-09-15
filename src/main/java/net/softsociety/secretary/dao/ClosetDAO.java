package net.softsociety.secretary.dao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.ClosetStyleDiary;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesManager;

@Mapper
public interface ClosetDAO {
	//옷장추가
	int insertCloset(Closet closet);
	//옷장삭제
	int delCloset(Closet closet);
	//옷장이름 수정
	int modifyCloset(Closet closet);

	//옷장리스트 출력
	ArrayList<Closet> findAllCloset();

	//옷장에 옷 추가
	void insertClothes(Clothes clothes);

	//옷장에 의류목록 출력
	ArrayList<Clothes> findAllClothes(HashMap<String, Object> map);
	ArrayList<Clothes> findAllClothesByCloset(Closet closet);

	//옷장 옷 찾기
	Clothes findClothes(HashMap<String, Integer> map);
	//옷장 옷 삭제
	int deleteClothes(HashMap<String, Integer> map);
	//옷장 옷 수정
	int updateClothes(Clothes clothes);
	
	//소재별 세탁및관리방법 찾아오기
	ClothesManager howToManageClothes(String clothesMaterial);
	//세탁물 체크
	void laundryIn(Clothes clothes);
	//세탁물 다시 옷장으로
	void laundryOut(HashMap<String, Integer> map);
	
	//차트데이터 값 불러오기
	HashMap<String, BigDecimal> getChartValue(int closetNum);
	
	//코디일지 : 코디일지 작성
	void createStyle(ClosetStyleDiary diary);
	//코디일지 : 코디일지 찾기
	ClosetStyleDiary findDiary(HashMap<String, Object> map);
	//코디일지 : 코디 목록 출력 & 검색
	ArrayList<ClosetStyleDiary> findAllDiary(HashMap<String, String> map);
	//코디일지 : 차트 데이터값 불러오기
	HashMap<String, BigDecimal> getDiaryChartValue(String userId);

}
