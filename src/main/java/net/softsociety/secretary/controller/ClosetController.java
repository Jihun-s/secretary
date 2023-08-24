package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.service.UserService;
import net.softsociety.secretary.util.FileService;

@Slf4j
@RequestMapping("closet")
@Controller
public class ClosetController {
	
	@Autowired
	UserService service;

	@ResponseBody
	@PostMapping("insertCloset")
	public void insertCloset(String closetName) {
		log.debug("전달된 값:{}", closetName);
	}	
	
	
	
	
	String uploadPath = "c:/boardfile";
	
	@GetMapping("insertClothes")
	public String insertClothes() {
		return "insertClothes";
	}
	
	@PostMapping("insertClothes")
	public String insertClothes(MultipartFile upload) {
		log.debug("매핑");
		if(upload!=null && !upload.isEmpty()) {
			String savedfile = FileService.saveFile(upload, uploadPath);
			log.debug(savedfile);
		}
		return "insertClothes";
	}
	
}
