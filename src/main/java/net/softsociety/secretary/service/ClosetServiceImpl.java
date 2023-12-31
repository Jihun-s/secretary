package net.softsociety.secretary.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ClosetDAO;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.ClosetStyleDiary;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesFromStore;
import net.softsociety.secretary.util.PageNavigator;

@Slf4j
@Service
public class ClosetServiceImpl implements ClosetService {

	@Autowired
	ClosetDAO dao;

	//옷장추가
	@Override
	public int insertCloset(Closet closet) {
		return dao.insertCloset(closet);
	}
	
	//옷장삭제
	@Override
	public int delCloset(Closet closet) {
		return dao.delCloset(closet);
	}

	//옷장이름 수정
	@Override
	public int modifyCloset(Closet closet) {
		return dao.modifyCloset(closet);
	}
	
	//옷장 리스트 출력
	@Override
	public ArrayList<Closet> findAllCloset() {
		return dao.findAllCloset();
	}
	@Override
	public Closet findCloset(int closetNum) {
		return dao.findCloset(closetNum);
	}

	//옷장에 옷 추가
	@Override
	public void insertClothes(Clothes clothes) {
		log.debug("옷 객체:{}",clothes);
		dao.insertClothes(clothes);
	}

	//옷장안에 의류전체목록 출력
	@Override
	public ArrayList<Clothes> findAllClothes(int closetNum, String category, String size, String material, String[] seasonArr, boolean clothesLaundry) {
		HashMap<String, Object> map = new HashMap<>();
		if(seasonArr == null) {
			log.debug("계절 Null");
		}else {
			StringBuilder temp = new StringBuilder();
			for(String s : seasonArr) {
				temp.append(s+',');
			}
			String season = temp.toString();
			season = season.substring(0, season.length()-1);
			log.debug("dddf:{}", season);
			map.put("seasons", season);
		}

		map.put("clothesLaundry",clothesLaundry);		
		map.put("closetNum", closetNum);
		map.put("category", category);
		map.put("size",size);
		map.put("material", material);
		log.debug("map:{}", map);

		return dao.findAllClothes(map);
	}
	
	//옷장안에 모든의류 출력
	@Override
	public ArrayList<Clothes> findAllClothes(Closet closet) {
		return dao.findAllClothesByCloset(closet);
	}

	//옷장안에 옷번호로 의류하나 찾기
	@Override
	public Clothes findClothes(int closetNum, int clothesNum) {
		//옷장번호, 옷번호 담을 해쉬맵
		HashMap<String, Integer> map = new HashMap<>();
		map.put("closetNum", closetNum);
		map.put("clothesNum", clothesNum);
		
		return dao.findClothes(map);
	}

	//옷장안 의류 삭제
	@Override
	public int deleteClothes(int closetNum, int clothesNum) {
		//옷장번호, 옷번호 담을 해쉬맵
		HashMap<String, Integer> map = new HashMap<>();
		map.put("closetNum", closetNum);
		map.put("clothesNum", clothesNum);
		return dao.deleteClothes(map);
	}

	//옷장안 의류정보 수정
	@Override
	public int updateClothes(Clothes clothes) {

		return dao.updateClothes(clothes);
	}
	
	//세탁물 체크
	@Override
	public void laundryIn(Clothes clothes) {
		dao.laundryIn(clothes);
	}

	//세탁물 체크하면 착용횟수 증가
	@Override
	public void plusPutOnCnt(Clothes clothes) {
		dao.plusPutOnCnt(clothes);
	}

	//세탁물 다시 옷장으로
	@Override
	public void laundryOut(int closetNum, int clothesNum) {
		//옷장번호, 옷번호 담을 해쉬맵
		HashMap<String, Integer> map = new HashMap<>();
		map.put("closetNum", closetNum);
		map.put("clothesNum", clothesNum);
		dao.laundryOut(map);
	}

	//차트데이터 값 불러오기
	@Override
	public HashMap<String, BigDecimal> getChartValue(int closetNum, boolean clothesLaundry) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("closetNum", closetNum);
		if(clothesLaundry == true) {
			map.put("clothesLaundry", 1);
		} else {
			map.put("clothesLaundry", 0);
		}
		return dao.getChartValue(map);
	}
	
	//코디일지 : 코디일지 등록
	@Override
	public void createStyle(ClosetStyleDiary diary) {
		dao.createStyle(diary);
	}
	
	//코디일지 : 일지찾기
	@Override
	public ClosetStyleDiary findDiary(int styleNum, String userId) {
		//일지번호, 유저 아이디 담을 해쉬맵
		HashMap<String, Object> map = new HashMap<>();
		map.put("styleNum", styleNum);
		map.put("userId", userId);
		return dao.findDiary(map);
	}

	//코디일지 : 일지 목록 출력
	@Override
	public ArrayList<ClosetStyleDiary> findAllDiary(String userId, String[] seasonArr, String styleTPO,
			String searchWord) {
		HashMap<String, String> map = new HashMap<>();
		
		//계절
		if(seasonArr == null) {
			log.debug("계절 Null");
		}else {
			StringBuilder temp = new StringBuilder();
			for(String s : seasonArr) {
				temp.append(s+',');
			}
			String season = temp.toString();
			season = season.substring(0, season.length()-1);
			log.debug("계절:{}", season);
			map.put("seasons", season);
		}
		map.put("userId", userId);
		map.put("styleTPO", styleTPO);
		map.put("searchWord", searchWord);
	
		return dao.findAllDiary(map);
	}

	//코디일지- 차트데이터 값 불러오기
	@Override
	public HashMap<String, BigDecimal> getDiaryChartValue(String userId) {
		return dao.getDiaryChartValue(userId);
	}

	//코디일지- 코디일지 수정
	@Override
	public void updateStyle(ClosetStyleDiary diary) {
		dao.updateStyle(diary);
	}
	
	//코디일지 - 삭제
	@Override
	public int deleteStyleDiary(ClosetStyleDiary diary) {
		return dao.deleteStyleDiary(diary);
	}

	//의류등록 웹에서 찾기 - 의류 리스트 출력
	@Override
	public ArrayList<ClothesFromStore> findAllClothesFromStore(PageNavigator navi, 
			String searchKeyword, String clothesFromStoreBrand, String clothesFromStoreCategory) {
		HashMap<String, String> map = new HashMap<>();
		map.put("searchKeyword", searchKeyword);
		map.put("clothesFromStoreBrand", clothesFromStoreBrand);
		map.put("clothesFromStoreCategory", clothesFromStoreCategory);
		RowBounds rb = new RowBounds(navi.getStartRecord(), navi.getCountPerPage());
		return dao.findAllClothesFromStore(map, rb);
	}

	//웹에서 찾기 - 페이지정보
	@Override
	public PageNavigator getPageNavigator(int pagePerGroup, int countPerPage, int page, 
					String searchKeyword, String clothesFromStoreBrand, String clothesFromStoreCategory) {
		HashMap<String, String> map = new HashMap<>();
		map.put("searchKeyword", searchKeyword);
		map.put("clothesFromStoreBrand", clothesFromStoreBrand);
		map.put("clothesFromStoreCategory", clothesFromStoreCategory);
		int total = dao.getTotal(map);
		PageNavigator navi = new PageNavigator(pagePerGroup, countPerPage, page, total);
		return navi;
	}
	
	//웹에서 찾기 - 옷 정보
	@Override
	public ClothesFromStore readClothesFromStore(String imgUrl) {
		return dao.readClothesFromStore(imgUrl);
	}
		
	
}
