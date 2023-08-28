package net.softsociety.secretary.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.ClosetDAO;
import net.softsociety.secretary.domain.Closet;

@Service
public class ClosetServiceImpl implements ClosetService {

	@Autowired
	ClosetDAO dao;

	@Override
	public int insertCloset(Closet closet) {
		return dao.insertCloset(closet);
	}

	@Override
	public ArrayList<Closet> findAllCloset() {
		return dao.findAllCloset();
	}
	
	
}
