package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.ClosetDAO;

@Service
public class ClosetServiceImpl implements ClosetService {

	@Autowired
	ClosetDAO dao;
	
	
}
