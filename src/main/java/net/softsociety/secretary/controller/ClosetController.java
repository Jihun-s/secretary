package net.softsociety.secretary.controller;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
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
import net.softsociety.secretary.util.FileService;

@Slf4j
@RequestMapping("closet")
@Controller
public class ClosetController {
	
	@Autowired
	ClosetService service;
	
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
		log.debug("************processImage 매핑****************");
		String savedfile = FileService.saveFile(image, uploadPath);
		returnfile = FileService.processImg(savedfile, uploadPath);
		Path path = Paths.get(uploadPath + "/"+ returnfile);
		byte[] imageBytes = Files.readAllBytes(path);

		return ResponseEntity.ok(imageBytes);
	}
	
	//옷장에 의류추가
	@ResponseBody
	@PostMapping("insertClothes")
	public void insertClothes(Clothes clothes, MultipartFile uploadFile, boolean clothesEditcheck) {
		log.debug("***********************옷등록 매핑**********************");
		log.debug("의류추가전 옷 객체:{}", clothes);
		log.debug("옷이미지 파일 :{}", uploadFile);//편집한 사진일경우 Null
		log.debug("편집여부 :{}", clothesEditcheck);
		
		if(clothesEditcheck) {
			/*편집한 사진일 경우,
			uploadFile은 Null, processImage 실행중에 저장된 returnfile값을 clothes객체에 저장 */
			clothes.setClothesImg(returnfile);
		} else {
			/*편집안한 사진일 경우,
			uploadFile에 사용자가 첨부한 파일있음 */
			String savedfile = FileService.saveFile(uploadFile, uploadPath);
			clothes.setClothesImg(savedfile);
		}
		service.insertClothes(clothes);
	}
	
	
	//옷장안 의류목록(옷번호 배열 반환)
	@ResponseBody
	@GetMapping("inCloset")
	public ArrayList<Integer> clothesListInCloset(@RequestParam(name="closetNum") int closetNum, String category, String size
													,String[] seasonArr, String material) {
		log.debug("옷장 번호: {}", closetNum);
		log.debug("분류: {}", category);
		log.debug("사이즈: {}", size);
		log.debug("소재: {}", material);
		if(seasonArr == null) {
			log.debug("계절 해당없음");
		} else {
		for(String season:seasonArr) {
			log.debug("계절:{}", season);
			}
		};
		
		//옷장안에 의류리스트 불러오기
		ArrayList<Clothes> clothesList = service.findAllClothes(closetNum, category, size, material, seasonArr);
		//의류리스트 옷번호 배열에 담기
		ArrayList<Integer> clothesNumList = new ArrayList<>();
		for(Clothes i : clothesList) {
			clothesNumList.add(i.getClothesNum());
		}
		return clothesNumList;
	}
	
	//옷 자세히보기
	@ResponseBody
	@GetMapping("readClothes")
	public Clothes readClothes(@RequestParam(name="closetNum") int closetNum,
							@RequestParam(name="clothesNum") int clothesNum) {
		log.debug("readClothes 매핑!");
		Clothes clothes = service.findClothes(closetNum, clothesNum);
		return clothes;
	}

	//옷이미지 다운로드 (옷장안에 이미지 구현)
	@GetMapping("clothesDownload")
	public void clothesDownload(@RequestParam(name="closetNum") int closetNum,
								@RequestParam(name="clothesNum") int clothesNum,
								HttpServletRequest request, HttpServletResponse response) {
		Clothes clothes = service.findClothes(closetNum, clothesNum);
		String fullPath = uploadPath + "/" + clothes.getClothesImg();
		
		try {
			response.setHeader("Content-Disposition", " attachment;filename=" + URLEncoder.encode(clothes.getClothesOriginalFile(), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		try {
			FileInputStream in = new FileInputStream(fullPath);
			ServletOutputStream out = response.getOutputStream();
			FileCopyUtils.copy(in, out);
			in.close();
			out.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	//옷 삭제
	@ResponseBody
	@GetMapping("deleteClothes")
	public void deleteClothes(@RequestParam(name="closetNum") int closetNum,
							@RequestParam(name="clothesNum") int clothesNum) {
		log.debug("deleteClothes 매핑!");
		Clothes clothes = service.findClothes(closetNum, clothesNum);
		if(clothes.getClothesImg() != null || clothes.getClothesImg() != "") {
			String fullPath = uploadPath + "/" + clothes.getClothesImg();
			FileService.deleteFile(fullPath);
		}
		int n = service.deleteClothes(closetNum, clothesNum);
		if( n == 0 ) {
			log.debug("옷 삭제 실패");
		} else {
			log.debug("옷 삭제 성공");
		}
	}
	
}
