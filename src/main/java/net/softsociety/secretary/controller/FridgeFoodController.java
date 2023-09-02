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

import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.service.FridgeFoodService;
import net.softsociety.secretary.util.FileService;

@Controller
@RequestMapping("/fridgeFood")
public class FridgeFoodController {
    
    @Autowired
    private FridgeFoodService fridgeFoodService;
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;// = "c:/secretary";
    
    @ResponseBody
    @PostMapping("/add")
    public ResponseEntity<?> addFridgeFood(@ModelAttribute FridgeFood fridgeFood, MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
            	String savedFileName = FileService.saveFile(file, uploadPath);
                // 파일 저장 로직
                // ...
                fridgeFood.setFoodOriginalFile(file.getOriginalFilename());
                fridgeFood.setFoodSavedFile(savedFileName);  // 저장된 파일명
            } else {
                fridgeFood.setFoodSavedFile("/images/fridgeimg/DefaultFood.webp");
            }
            fridgeFoodService.addFridgeFood(fridgeFood);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}