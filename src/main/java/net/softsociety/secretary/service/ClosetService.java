package net.softsociety.secretary.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.ClosetStyleDiary;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesFromStore;
import net.softsociety.secretary.util.PageNavigator;

public interface ClosetService {

	int insertCloset(Closet closet);
	int modifyCloset(Closet closet);
	int delCloset(Closet closet);
	
	//옷장정보 불러오기
	ArrayList<Closet> findAllCloset();
	
	//옷장에 의류등록
	void insertClothes(Clothes clothes);

	// 옷장에 의류목록 출력 & 검색
	ArrayList<Clothes> findAllClothes(int closetNum, String category, String size, String material, String[] seasonArr, boolean clothesLaundry);
	ArrayList<Clothes> findAllClothes(Closet closet);
	
	// 옷장안 옷찾기
	Clothes findClothes(int closetNum, int clothesNum);
	// 옷장안 옷 삭제
	int deleteClothes(int closetNum, int clothesNum);
	
	//옷장안 의류정보 수정
	int updateClothes(Clothes clothes);
	
	//세탁물 체크
	void laundryIn(Clothes clothes);
	//세탁물 다시 옷장으로
	void laundryOut(int closetNum, int clothesNum);
	
	//차트데이터 값 불러오기
	HashMap<String, BigDecimal> getChartValue(int closetNum);
	
	//코디일지 - 코디일지 등록
	void createStyle(ClosetStyleDiary diary);
	//코디일지 - 코디일지 찾기
	ClosetStyleDiary findDiary(int styleNum, String userId);
	//코디일지 - 일지목록 출력&검색
	ArrayList<ClosetStyleDiary> findAllDiary(String userId, String[] seasonArr, String styleTPO, String searchWord);
	//코디일지 - 차트데이터 값 불러오기
	HashMap<String, BigDecimal> getDiaryChartValue(String userId);
	//코디일지 - 코디일지 수정
	void updateStyle(ClosetStyleDiary diary);
	//코디일지 - 코디일지 삭제
	int deleteStyleDiary(ClosetStyleDiary diary);
	
	//의류등록 웹에서 찾기 - 의류 리스트 출력
	ArrayList<ClothesFromStore> findAllClothesFromStore(PageNavigator navi, String searchKeyword, String clothesFromStoreBrand,
			String clothesFromStoreCategory);
	//웹에서 찾기 - 페이지작업
	PageNavigator getPageNavigator(int pagePerGroup, int countPerPage, int page, String searchKeyword,
			String clothesFromStoreBrand, String clothesFromStoreCategory);
	//웹에서 찾기 - 옷 정보
	ClothesFromStore readClothesFromStore(String imgUrl);
	
	//세탁물 체크하면 착용횟수 증가
	void plusPutOnCnt(Clothes clothes);

	
}
