package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FridgeFood;
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
}