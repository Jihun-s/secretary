package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.Log;

public interface LogService {

	void saveLog(Log log) ;

	List<Log> getAllLogs();	
	

}
