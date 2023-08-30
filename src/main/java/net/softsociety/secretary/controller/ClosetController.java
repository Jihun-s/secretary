package net.softsociety.secretary.controller;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
	
	//편집된 사진경로 담을 변수
	String returnfile = "";
	
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
		log.debug("processImage 매핑!!!!!!!");
		String savedfile = FileService.saveFile(image, uploadPath);
		returnfile = FileService.processImg(savedfile, uploadPath);
		log.debug("파일경로:{}",returnfile);
		Path path = Paths.get(returnfile);
		log.debug("path:{}",path);
		byte[] imageBytes = Files.readAllBytes(path);

		return ResponseEntity.ok(imageBytes);
	}
	
	//옷장에 의류추가
	@ResponseBody
	@PostMapping("insertClothes")
	public void insertClothes(Clothes clothes, MultipartFile clothesIMG, boolean clothesEditcheck) {
		log.debug("옷등록 매핑");
		log.debug("옷 객체:{}", clothes);
		log.debug("옷이미지 파일 :{}", clothesIMG);
		log.debug("편집여부 :{}", clothesEditcheck);
		
		if(clothesEditcheck) {
			clothes.setClothesImg(returnfile);
			log.debug("옷 객체:{}", clothes);
		} else {
			String savedfile = FileService.saveFile(clothesIMG, uploadPath);
			clothes.setClothesImg(savedfile);
			log.debug("저장된 파일:{}", savedfile);
		}
		service.insertClothes(clothes);
	}
	
	//옷장에 의류목록 보여주기
	@ResponseBody
	@PostMapping("clothesList")
	public ArrayList<Clothes> clothesList(@RequestParam(name="closetNum") int closetNum
										, HttpServletRequest request
										, HttpServletResponse response){
		log.debug("clothesList 매핑");
		log.debug("{}", request.getRemoteAddr());
		
		
		ArrayList<Clothes> clothesList = service.findClothes(closetNum);
		return clothesList;
	}
	
}
