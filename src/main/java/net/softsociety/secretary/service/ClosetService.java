package net.softsociety.secretary.service;

import java.util.ArrayList;

import net.softsociety.secretary.domain.Closet;

public interface ClosetService {

	int insertCloset(Closet closet);
	
	//옷장정보 불러오기
	ArrayList<Closet> findAllCloset();

}
