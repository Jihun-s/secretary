package net.softsociety.secretary.service;

import net.softsociety.secretary.domain.User;

public interface UserService {
	void register(User user, String siteURL);
	
	boolean verify(String token);

	User findByEmail(String email);

	boolean existsByEmail(String userEmail);

	boolean existsByUserId(String userId);
}