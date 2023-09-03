package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeFoodListWrapper;
import net.softsociety.secretary.service.FridgeFoodService;
import net.softsociety.secretary.util.FileService;

@Slf4j
@Controller
@RequestMapping("/fridgeFood")
public class FridgeFoodController {
    
    @Autowired
    private FridgeFoodService fridgeFoodService;
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;// = "c:/secretary";
    
	//단일 추가
    @PostMapping("/add")
    public String addFridgeFood(@ModelAttribute FridgeFood fridgeFood, MultipartFile foodImage) {
    	
        try {
            if (foodImage != null && !foodImage.isEmpty()) {
            	String savedFileName = FileService.saveFile(foodImage, uploadPath);
                // 파일 저장 로직
                // ...
                fridgeFood.setFoodOriginalFile(foodImage.getOriginalFilename());
                fridgeFood.setFoodSavedFile(savedFileName);  // 저장된 파일명
            }
            fridgeFoodService.addFridgeFood(fridgeFood);
            return "redirect:/fridge";
        } catch (Exception e) {
        	return "error-page";
        }
    }
  //영수증을 통한 다중 추가
    @PostMapping("/addFromReceipt")
    public String addFridgeFoodFromReceipt(@ModelAttribute FridgeFoodListWrapper wrapper) {
        List<FridgeFood> fridgeFoods = wrapper.getFridgeFoods();
        log.debug("이게 제대로 오긴 해요? : {}",fridgeFoods);
        try {
            for (FridgeFood fridgeFood : fridgeFoods) {
                // 이미지 처리 코드는 제거
                fridgeFoodService.addFridgeFood(fridgeFood);
            }
            return "redirect:/fridge";
        } catch (Exception e) {
            log.error("An error occurred: {}", e.getMessage(), e);
            return "error-page";
        }
    }
}