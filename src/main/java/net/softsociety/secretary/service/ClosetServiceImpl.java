package net.softsociety.secretary.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ClosetDAO;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;

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
	
	//옷장 리스트 출력
	@Override
	public ArrayList<Closet> findAllCloset() {
		return dao.findAllCloset();
	}
	
	//옷장에 옷 추가
	@Override
	public void insertClothes(Clothes clothes) {
		log.debug("옷 객체:{}",clothes);
		dao.insertClothes(clothes);
	}

	//옷장안에 의류전체목록 출력
	@Override
	public ArrayList<Clothes> findAllClothes(int closetNum, String category, String size, String material, String[] seasonArr) {
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
		map.put("closetNum", closetNum);
		map.put("category", category);
		map.put("size",size);
		map.put("material", material);
		log.debug("map:{}", map);

		return dao.findAllClothes(map);
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
	
	
	
	
	
}
