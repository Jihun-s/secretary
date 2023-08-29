package net.softsociety.secretary.service;

import java.util.ArrayList;

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
	
	//옷장리스트 출력
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
	
	
}
