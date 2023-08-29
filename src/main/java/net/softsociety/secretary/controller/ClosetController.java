package net.softsociety.secretary.controller;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.service.ClosetService;
import net.softsociety.secretary.service.UserService;
import net.softsociety.secretary.util.FileService;

@Slf4j
@RequestMapping("closet")
@Controller
public class ClosetController {
	
	@Autowired
	ClosetService service;

	@Autowired
	UserService userService;
	
	//파일저장 경로
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;
	
	//옷장추가
	@ResponseBody
	@PostMapping("insertCloset")
	public void insertCloset(Closet closet) {
		log.debug("{}",closet);
		int n = service.insertCloset(closet);
		if(n != 1) {
			log.debug("옷장 추가 실패");
		}
	}	
	
	//사진 편집
	@ResponseBody
	@PostMapping(value="processImage", produces = MediaType.IMAGE_PNG_VALUE)
	public ResponseEntity<byte[]> processImage(MultipartFile image) throws IOException {
		log.debug("매핑!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		String returnfile = "";
		String savedfile = FileService.saveFile(image, uploadPath);
		returnfile = FileService.processImg(savedfile, uploadPath);
		log.debug("파일경로:{}",returnfile);
		Path path = Paths.get(returnfile);
		log.debug("path:{}",path);
		byte[] imageBytes = Files.readAllBytes(path);

		return ResponseEntity.ok(imageBytes);
	}
	
	@ResponseBody
	@PostMapping("insertClothes")
	public void insertClothes(Clothes clothes, MultipartFile clothesIMG) {
		log.debug("옷등록 매핑");
		log.debug("옷 객체:{}", clothes);
		if(clothesIMG !=null && !clothesIMG.isEmpty()) {
			String savedfile = FileService.saveFile(clothesIMG, uploadPath);
			clothes.setClothesImg(savedfile);
		}
		log.debug("옷 파일:{}", clothesIMG);
		service.insertClothes(clothes);
	}
	
}
