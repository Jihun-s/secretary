package net.softsociety.secretary.dao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.ClosetStyleDiary;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesFromStore;

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
	
	//세탁물 체크
	void laundryIn(Clothes clothes);
	//세탁물 체크하면 착용횟수 증가
	void plusPutOnCnt(Clothes clothes);
	//세탁물 다시 옷장으로
	void laundryOut(HashMap<String, Integer> map);
	
	//차트데이터 값 불러오기
	HashMap<String, BigDecimal> getChartValue(HashMap<String, Integer> map);
	
	//코디일지 : 코디일지 작성
	void createStyle(ClosetStyleDiary diary);
	//코디일지 : 코디일지 찾기
	ClosetStyleDiary findDiary(HashMap<String, Object> map);
	//코디일지 : 코디 목록 출력 & 검색
	ArrayList<ClosetStyleDiary> findAllDiary(HashMap<String, String> map);
	//코디일지 : 차트 데이터값 불러오기
	HashMap<String, BigDecimal> getDiaryChartValue(String userId);
	//코디일지 : 코디일지 수정
	void updateStyle(ClosetStyleDiary diary);
	//코디일지 : 코디일지 삭제
	int deleteStyleDiary(ClosetStyleDiary diary);
	
	//의류등록 웹에서 찾기 - 의류 리스트 출력
	ArrayList<ClothesFromStore> findAllClothesFromStore(HashMap<String, String> map, RowBounds rb);
	int getTotal(HashMap<String, String> map);
	
	//웹에서 찾기 - 의류정보
	ClothesFromStore readClothesFromStore(String imgUrl);

}
