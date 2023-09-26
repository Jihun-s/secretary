package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.CashbookDAO;
import net.softsociety.secretary.dao.UserMapper;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeFoodListWrapper;
import net.softsociety.secretary.domain.Transaction;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.CashbookService;
import net.softsociety.secretary.util.FileService;

@Slf4j
@Controller
@RequestMapping("/cashbook/trans")
public class CashbookTransController {
	
	@Autowired
	CashbookService service;
	
	@Autowired
	CashbookDAO dao;
	
	@Autowired
	UserMapper userdao;



}
