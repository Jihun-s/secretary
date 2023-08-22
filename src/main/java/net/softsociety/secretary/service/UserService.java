package net.softsociety.secretary.service;

import net.softsociety.secretary.domain.User;

public interface UserService {
	void register(User user, String siteURL);
	
	boolean verify(String token);
}