package net.softsociety.secretary.controller;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;

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
import net.softsociety.secretary.domain.ClothesFromStore;
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

	//게시판 목록의 페이지당 글 수
	@Value("${clothesFromStore.page}")
	int countPerPage;
	//게시판 목록의 페이지 이동 링크 수
	@Value("${user.board.group}")
	int pagePerGroup;	
	
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
	
	//옷장 수정
	@ResponseBody
	@PostMapping("modifyCloset")
	public void modifyCloset(Closet closet) {
		log.debug("{}",closet);
		int n = service.modifyCloset(closet);
		if(n != 1) {
			log.debug("옷장 추가 실패");
		}
	}
	
	//옷장 삭제
	@ResponseBody
	@PostMapping("delCloset")
	public void delCloset(Closet closet) {
		log.debug("옷장삭제 매핑!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		log.debug("삭제할 옷장:{}",closet);
		//옷장안에 의류리스트 불러오기
		ArrayList<Clothes> clothesList = service.findAllClothes(closet);	
		log.debug("옷장안 의류리스트:{}", clothesList);
		for(Clothes clothes : clothesList) {
			if(clothes.getClothesImg() != null || clothes.getClothesImg() != "") {
				String fullPath = uploadPath + "/" + clothes.getClothesImg();
				FileService.deleteFile(fullPath);
			}		
		}
		
		int n = service.delCloset(closet);
		if(n != 1) {
			log.debug("옷장 추가 실패");
		}		
	}	
	
	//사진 편집
	@ResponseBody
	@PostMapping(value="processImage", produces = MediaType.IMAGE_PNG_VALUE)
	public ResponseEntity<byte[]> processImage(MultipartFile image, String fromStore) throws IOException {
		log.debug("************processImage 매핑****************");
		log.debug("fromstore변수:{}",fromStore);
		if(fromStore.equals("NoFromStore")) {
			String savedfile = FileService.saveFile(image, uploadPath);
			returnfile = FileService.processImg(savedfile, uploadPath);
			Path path = Paths.get(uploadPath + "/"+ returnfile);
			byte[] imageBytes = Files.readAllBytes(path);

			return ResponseEntity.ok(imageBytes);
		} else {
			returnfile = FileService.processImg(fromStore, uploadPath);
			Path path = Paths.get(uploadPath + "/"+ returnfile);
			byte[] imageBytes = Files.readAllBytes(path);

			return ResponseEntity.ok(imageBytes);
		}
		
	}
	
	//옷장에 의류추가
	@ResponseBody
	@PostMapping("insertClothes")
	public void insertClothes(Clothes clothes, MultipartFile uploadFile, boolean clothesEditcheck, String fromStoreCheck) {
		log.debug("***********************옷등록 매핑**********************");
		log.debug("의류추가전 옷 객체:{}", clothes);
		log.debug("옷이미지 파일 :{}", uploadFile);//편집한 사진일경우 Null
		log.debug("편집여부 :{}", clothesEditcheck);
		log.debug("fromStore여부 :{}", fromStoreCheck);
		
		if(clothesEditcheck && fromStoreCheck.equals("해당없음")) {
			/*편집한 사진파일 && fromStore 아닌경우
			uploadFile은 Null, processImage 실행중에 저장된 returnfile값을 clothes객체에 저장 */
			clothes.setClothesImg(returnfile);
		} else if(!clothesEditcheck && !fromStoreCheck.equals("해당없음")) {
			/*편집 안함, fromStore일 경우 */
			String savedfile = FileService.CopyImg(fromStoreCheck, uploadPath);
			clothes.setClothesImg(savedfile);
		} else if(clothesEditcheck && !fromStoreCheck.equals("해당없음")){
			/*편집함, fromStore일 경우*/
			clothes.setClothesImg(returnfile);
			clothes.setClothesOriginalFile(returnfile);
		} else {
			/*편집안한 사진파일의 경우, uploadFile에 사용자가 첨부한 파일있음 */
			String savedfile = FileService.saveFile(uploadFile, uploadPath);
			clothes.setClothesImg(savedfile);
		}
		service.insertClothes(clothes);
	}
	
	//의류정보 수정
	@ResponseBody
	@PostMapping("updateClothes")
	public void updateClothes(Clothes clothes, MultipartFile uploadFile, boolean clothesEditcheck, String fromStoreCheck) {
		log.debug("***********************옷수정 매핑**********************");
		log.debug("의류수정전 옷 객체:{}", clothes);
		log.debug("옷이미지 파일 :{}", uploadFile);//사진변경 안했을경우 '사진변경안함', 변경했으면 multifile 객체, 변경하고 편집했으면 null값
		log.debug("편집여부 :{}", clothesEditcheck);
		
		Clothes oldClothes = service.findClothes(clothes.getClosetNum(), clothes.getClothesNum());
		
		if((uploadFile == null) && !clothesEditcheck && fromStoreCheck.equals("해당없음")) {
			log.debug("사진 파일 X & 편집 X & 웹에서 찾기 아님  -> 기존 사진 그대로 이용");
			clothes.setClothesOriginalFile(oldClothes.getClothesOriginalFile());
			clothes.setClothesImg(oldClothes.getClothesImg());
		}else if((uploadFile == null) && !clothesEditcheck && !fromStoreCheck.equals("해당없음")) {
			log.debug("사진 파일 X & 편집 X & 웹에서 찾기 O");
			String fullPath = uploadPath + "/" + oldClothes.getClothesImg();
			FileService.deleteFile(fullPath); //원래 사진 삭제
			String savedfile = FileService.CopyImg(fromStoreCheck, uploadPath);
			clothes.setClothesImg(savedfile);
		}else if((uploadFile == null) && clothesEditcheck && !fromStoreCheck.equals("해당없음")) {
			log.debug("사진 파일 X & 편집 O & 웹에서 찾기 O");
			String fullPath = uploadPath + "/" + oldClothes.getClothesImg();
			FileService.deleteFile(fullPath); //원래 사진 삭제
			clothes.setClothesImg(returnfile);
			clothes.setClothesOriginalFile(returnfile);
		}else if((uploadFile != null) && !clothesEditcheck && fromStoreCheck.equals("해당없음")) {
			log.debug("사진 변경함 & 편집 안함 & 웹에서 찾기 아님");
			String fullPath = uploadPath + "/" + oldClothes.getClothesImg();
			FileService.deleteFile(fullPath); //원래 사진 삭제
			String savedfile = FileService.saveFile(uploadFile, uploadPath);
			clothes.setClothesImg(savedfile);
		}else if((uploadFile == null) && clothesEditcheck && fromStoreCheck.equals("해당없음") ) {
			log.debug("사진 변경함 & 편집 했음 & 웹에서 찾기 아님");
			String fullPath = uploadPath + "/" + oldClothes.getClothesImg();
			FileService.deleteFile(fullPath); //원래 사진 삭제
			clothes.setClothesImg(returnfile); //편집된 사진 저장
		}
		
		// 의류 수정
		int n = service.updateClothes(clothes);
		if(n==0) {
			log.debug("의류수정 실패");
		} else {
			log.debug("의류수정 성공");
		}
		
	}	
	
	//옷장안 의류목록(옷번호 배열 반환)
	@ResponseBody
	@GetMapping("inCloset")
	public ArrayList<Clothes> clothesListInCloset(@RequestParam(name="closetNum") int closetNum, String category, String size
												,String[] seasonArr, String material, boolean clothesLaundry) {
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
		log.debug("세탁물 여부 :{}", clothesLaundry);
		
		//옷장안에 의류리스트 불러오기
		ArrayList<Clothes> clothesList = service.findAllClothes(closetNum, category, size, material, seasonArr, clothesLaundry);

		return clothesList;
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
	
	//세탁물 체크
	@ResponseBody
	@GetMapping("laundryIn")
	public void laundryIn(@RequestParam(name="closetNum") int closetNum,
			@RequestParam(name="clothesNum") int clothesNum) {
		log.debug("laundryIn 매핑!");
		Clothes clothes = service.findClothes(closetNum, clothesNum);
		service.laundryIn(clothes);
	}
	
	//세탁물 다시 옷장으로
	@ResponseBody
	@GetMapping("laundryOut")
	public void laundryOut(@RequestParam(name="closetNum", defaultValue="0") int closetNum,
			@RequestParam(name="clothesNum", defaultValue="0") int clothesNum) {
		log.debug("laundryOut 매핑!");
		service.laundryOut(closetNum,clothesNum);
	}
	
	
	//차트데이터 값 불러오기
	@ResponseBody
	@GetMapping("chartValue")
	public HashMap<String, BigDecimal> getChartValue(@RequestParam(name="closetNum", defaultValue="0") int closetNum) {
		log.debug("chartValue 매핑!!!!!!!");
		HashMap<String, BigDecimal> valueList = service.getChartValue(closetNum);
		return valueList;
	}

	//옷이미지(의류등록-웹에서 찾기) 다운로드
	@GetMapping("clothesFromStoreDownload")
	public void clothesDownload(@RequestParam(name="clothesFromStoreImg") String clothesFromStoreImg,
								HttpServletRequest request, HttpServletResponse response) {
		String fullPath = uploadPath + "/" + clothesFromStoreImg;
		
		try {
			response.setHeader("Content-Disposition", " attachment;filename=" + URLEncoder.encode(clothesFromStoreImg, "UTF-8"));
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
			e.printStackTrace();
		}
	}
	
	@ResponseBody
	@GetMapping("readClothesFromStore")
	public ClothesFromStore readClothesFromStore(String imgUrl) {
		ClothesFromStore clothes = service.readClothesFromStore(imgUrl);
		return clothes;
	}
	
}
