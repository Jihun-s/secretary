package net.softsociety.secretary.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.repository.LogRepository;

@Service
public class LogServiceImpl implements LogService {
	
	private final LogRepository logRepository;
	
	@Autowired
	public LogServiceImpl(LogRepository logRepository) {
		this.logRepository = logRepository;
	}
	
	@Override
	@Transactional
	public void saveLog(Log log) {
		logRepository.save(log);
	}

	@Override
	public List<Log> getAllLogs() {
		
		return logRepository.findAll();
	}

}
