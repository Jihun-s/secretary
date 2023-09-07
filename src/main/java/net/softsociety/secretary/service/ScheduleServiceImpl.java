package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.ScheduleDAO;

@Slf4j
@Service
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	ScheduleDAO dao;
	
}
