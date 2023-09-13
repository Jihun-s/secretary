package net.softsociety.secretary.controller;



import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
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
	@PostMapping("styleImgCreate")
	public void styleImgCreate(String array,HttpServletRequest request) throws Exception {
		if(array == null) {
			log.debug("array : null");
			return;
		}
		log.debug("전달받은 문자열: {}", array);
		
		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<Clothes> list = objectMapper.readValue(array, new TypeReference<ArrayList<Clothes>>() {});
		log.debug("변환결과 리스트:{}", list);
		log.debug("변환결과 리스트:{}", list.size());
		
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
		 ImageIO.write(mergedImage, "png", new File(uploadPath + "/" +savedPath));

	}//styleImgCreate
	
}
