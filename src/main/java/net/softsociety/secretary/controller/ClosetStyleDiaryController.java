package net.softsociety.secretary.controller;



import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.ClosetStyleDiary;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.service.ClosetService;
import net.softsociety.secretary.util.FileService;

@Slf4j
@RequestMapping("closet/styleDiary")
@Controller
public class ClosetStyleDiaryController {
	
	@Autowired
	ClosetService closetService;
	
	//파일저장 경로
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;
	
	private Map<Integer, BufferedImage> imageMap = new HashMap<Integer, BufferedImage>();
	
	@ResponseBody
	@PostMapping("styleCreate")
	public void styleImgCreate(String array,HttpServletRequest request, ClosetStyleDiary diary) throws Exception {
		log.debug("ClosetStyleDiary 객체 전송됐나요?:{}", diary);
		
		//의류 객체정보 String array로 전송받음
		if(array == null) {
			log.debug("array : null");
			return;
		}
		log.debug("전달받은 문자열: {}", array);
		//의류객체정보 diary객체에 저장
		diary.setStyleInfo(array);
		
		//Clothes 객체 리스트로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<Clothes> list = objectMapper.readValue(array, new TypeReference<ArrayList<Clothes>>() {});
		log.debug("변환결과 리스트:{}", list);
		log.debug("변환결과 리스트:{}", list.size());
		
		///Clothes 이미지파일 경로 추출
		ArrayList<String> imagePaths = new ArrayList<>();
		for(Clothes selectedList : list) {
			Clothes clothes = closetService.findClothes(selectedList.getClosetNum(), selectedList.getClothesNum());
			imagePaths.add(uploadPath+"/"+clothes.getClothesImg());
			log.debug("이미지 경로:{}", clothes.getClothesImg());
		}
		
		
		int x = 0;
		int y = 0;
		if(list.size()>=7) {
			y=0;
		} else if(list.size() >=4) {
			y= 50;
		} else if(list.size() < 4) {
			y = 100;
		}
		
		// 의류 각 이미지 조절하고, 합성해서 하나로 반환
		BufferedImage mergedImage = new BufferedImage(520, 370, BufferedImage.TYPE_INT_ARGB); 
		Graphics2D graphics = mergedImage.createGraphics();
		
		for(String imgPath : imagePaths) {
			BufferedImage originalImage = ImageIO.read(new File(imgPath));
			
			//각 이미지 크기를 조절
			BufferedImage resizedImage = new BufferedImage(520 / 3, 370 / 3, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = resizedImage.createGraphics();
            g.drawImage(originalImage, 0, 0, 520 / 3, 370 / 3, null);
            g.dispose();
            
            // 합성 이미지에 그리기
            graphics.drawImage(resizedImage, x, y, null);

            x += 520 / 3;
            if (x >= 518) {
                x = 0;
                y += 370 / 3;
            }
		}
		 graphics.dispose();
		 
		 String savedPath = FileService.mergedImgName(uploadPath);
		 ImageIO.write(mergedImage, "png", new File(uploadPath + "/" +savedPath)); //합성이미지 파일 생성&저장
		 //이미지파일경로 diary객체에 저장
		 diary.setStyleImg(savedPath);
		 log.debug("ClosetStyleDiary 객체 완성됐나요?:{}", diary);
		 
		 closetService.createStyle(diary);
	}//styleImgCreate
	
	
	//코디일지 수정
	@ResponseBody
	@PostMapping("styleUpdate")
	public void styleImgUpdate(String array,HttpServletRequest request, ClosetStyleDiary diary) throws Exception{
		log.debug("ClosetStyleDiary 객체 전송됐나요?:{}", diary);
		log.debug("array :{} ",array);
		//변경할 코디일지 이전 정보 가져오기
		ClosetStyleDiary oldDiary = closetService.findDiary(diary.getStyleNum(), diary.getUserId());
		//의류 객체정보 String array로 전송받음 & 이미지 변경 안했을 경우
		if(array == null || array.equals("[]")) {
			log.debug("이미지 변경 안함");
			diary.setStyleInfo(oldDiary.getStyleInfo());
			diary.setStyleImg(oldDiary.getStyleImg());
		} else {
			//과거 이미지파일 삭제하기
			if(oldDiary.getStyleImg() !=null || oldDiary.getStyleImg() !="") {
				String fullPath = uploadPath + "/" + oldDiary.getStyleImg();
				FileService.deleteFile(fullPath);
			}
			diary.setStyleInfo(array);
			//Clothes 객체 리스트로 변환
			ObjectMapper objectMapper = new ObjectMapper();
			ArrayList<Clothes> list = objectMapper.readValue(array, new TypeReference<ArrayList<Clothes>>() {});
			log.debug("변환결과 리스트:{}", list);
			log.debug("변환결과 리스트:{}", list.size());
			///Clothes 이미지파일 경로 추출
			ArrayList<String> imagePaths = new ArrayList<>();
			for(Clothes selectedList : list) {
				Clothes clothes = closetService.findClothes(selectedList.getClosetNum(), selectedList.getClothesNum());
				imagePaths.add(uploadPath+"/"+clothes.getClothesImg());
				log.debug("이미지 경로:{}", clothes.getClothesImg());
			}
			
			int x = 0;
			int y = 0;
			if(list.size()>=7) {
				y=0;
			} else if(list.size() >=4) {
				y= 50;
			} else if(list.size() < 4) {
				y = 100;
			}
			
			// 의류 각 이미지 조절하고, 합성해서 하나로 반환
			BufferedImage mergedImage = new BufferedImage(520, 370, BufferedImage.TYPE_INT_ARGB); 
			Graphics2D graphics = mergedImage.createGraphics();
			
			for(String imgPath : imagePaths) {
				BufferedImage originalImage = ImageIO.read(new File(imgPath));
				
				//각 이미지 크기를 조절
				BufferedImage resizedImage = new BufferedImage(520 / 3, 370 / 3, BufferedImage.TYPE_INT_ARGB);
	            Graphics2D g = resizedImage.createGraphics();
	            g.drawImage(originalImage, 0, 0, 520 / 3, 370 / 3, null);
	            g.dispose();
	            
	            // 합성 이미지에 그리기
	            graphics.drawImage(resizedImage, x, y, null);

	            x += 520 / 3;
	            if (x >= 518) {
	                x = 0;
	                y += 370 / 3;
	            }
			}
			 graphics.dispose();
			 
			 String savedPath = FileService.mergedImgName(uploadPath);
			 ImageIO.write(mergedImage, "png", new File(uploadPath + "/" +savedPath)); //합성이미지 파일 생성&저장
			 //이미지파일경로 diary객체에 저장
			 diary.setStyleImg(savedPath);
			 log.debug("ClosetStyleDiary 객체 수정 완성됐나요?:{}", diary);			
		}//else문 끝 ( 이미지 변경 했을 경우)
		closetService.updateStyle(diary);
	}//styleUpdate(코디일지 수정)
	
	
	//코디일지 일지목록
	@ResponseBody
	@GetMapping("inStyleDiary")
	public ArrayList<ClosetStyleDiary> diaryListInStyleDiary(@RequestParam(name="userId") String userId,
											String[] seasonArr, String styleTPO, String searchWord){
		log.debug("유저아이디:{}", userId);
		if(seasonArr == null) {
			log.debug("계절 해당없음");
		} else {
		for(String season:seasonArr) {
			log.debug("계절:{}", season);
			}
		};		
		log.debug("TPO:{}", styleTPO);
		log.debug("검색어:{}", searchWord);
		
		ArrayList<ClosetStyleDiary> diaryList = closetService.findAllDiary(userId, seasonArr, styleTPO, searchWord);
		return diaryList;
	}
	
	
	
	//코디일지 이미지 다운로드
	@GetMapping("styleDiaryDownload")
	public void styleDiaryDownload(@RequestParam(name="styleNum") int styleNum,
								@RequestParam(name="userId") String userId,
								HttpServletRequest request, HttpServletResponse response) {
		ClosetStyleDiary diary = closetService.findDiary(styleNum, userId);
		log.debug("diary객체 찾았나요?:{}", diary);
		String fullPath = uploadPath + "/" + diary.getStyleImg();
		
		try {
			response.setHeader("Content-Disposition", " attachment;filename=" + URLEncoder.encode(diary.getStyleImg(), "UTF-8"));
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
	}//styleDiaryDownload
	
	@ResponseBody
	@GetMapping("readDiary")
	public ClosetStyleDiary readDiary(@RequestParam(name="styleNum") int styleNum,
			@RequestParam(name="userId") String userId) {
		ClosetStyleDiary diary = closetService.findDiary(styleNum, userId);
		log.debug("readDiary 객체:{}", diary);
		return diary;
	}
	
	@ResponseBody
	@GetMapping("chartValue")
	public HashMap<String, BigDecimal> getChartValue(@RequestParam(name="userId") String userId) {
		
		HashMap<String, BigDecimal> valueList = closetService.getDiaryChartValue(userId);
		return valueList;
	}
	
}
