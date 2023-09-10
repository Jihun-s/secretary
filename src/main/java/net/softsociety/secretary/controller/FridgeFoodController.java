package net.softsociety.secretary.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeFoodListWrapper;
import net.softsociety.secretary.domain.User;
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
    public String addFridgeFood(@ModelAttribute FridgeFood fridgeFood, MultipartFile foodImage, @ModelAttribute("loginUser") User user) {
    	
        try {
            if (foodImage != null && !foodImage.isEmpty()) {
            	String savedFileName = FileService.saveFile(foodImage, uploadPath);
                // 파일 저장 로직
                // ...
                fridgeFood.setFoodOriginalFile(foodImage.getOriginalFilename());
                fridgeFood.setFoodSavedFile(savedFileName);  // 저장된 파일명
            }
            fridgeFoodService.addFridgeFood(fridgeFood, user.getFamilyId());
            return "redirect:/fridge";
        } catch (Exception e) {
        	log.error("An error occurred: {}", e.getMessage(), e);
        	return "error-page";
        }
    }
  //영수증을 통한 다중 추가
    @PostMapping("/addFromReceipt")
    public String addFridgeFoodFromReceipt(@ModelAttribute FridgeFoodListWrapper wrapper, @ModelAttribute("loginUser") User user) {
        List<FridgeFood> fridgeFoods = wrapper.getFridgeFoods();
        log.debug("이게 제대로 오긴 해요? : {}",fridgeFoods);
        try {
            for (FridgeFood fridgeFood : fridgeFoods) {
                // 이미지 처리 코드는 제거
                fridgeFoodService.addFridgeFood(fridgeFood, user.getFamilyId());
            }
            return "redirect:/fridge";
        } catch (Exception e) {
            log.error("An error occurred: {}", e.getMessage(), e);
            return "error-page";
        }
    }
    //음식 가져오기
    @ResponseBody
    @GetMapping("/food/{foodId}")
    public FridgeFood getFoodDetails(@PathVariable int foodId) {
        return fridgeFoodService.getFoodDetails(foodId);
    }
    
    //전체 음식 출력
    @ResponseBody
    @GetMapping("/getAllFoods")
    public List<FridgeFood> getAllFridgeFoods() {
        return fridgeFoodService.getAllFridgeFoods();
    }
    
    @ResponseBody
    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String fileName) {
        try {
            // 이미지를 제공할 경로 설정
            String imagePath = "c:/secretaryfile/";

            // 이미지 파일 로드
            Path imageFilePath = Paths.get(imagePath + fileName);
            Resource imageResource = new UrlResource(imageFilePath.toUri());

            // 파일 확장자에 따라 콘텐츠 유형 결정
            MediaType contentType = MediaTypeFactory.getMediaType(imageResource).orElse(MediaType.IMAGE_JPEG);

            // 이미지 응답으로 전송
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(imageResource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/modify/{foodId}")
    public String modifyFridgeFood(@PathVariable int foodId, @ModelAttribute FridgeFood fridgeFood, MultipartFile foodImage, @ModelAttribute("loginUser") User user) {
        try {
            // 이미지 변경 로직
            if (foodImage != null && !foodImage.isEmpty()) {
                String savedFileName = FileService.saveFile(foodImage, uploadPath);
                fridgeFood.setFoodOriginalFile(foodImage.getOriginalFilename());
                fridgeFood.setFoodSavedFile(savedFileName);
            }
            fridgeFood.setFoodId(foodId);

            fridgeFoodService.modifyFridgeFood(fridgeFood, user.getFamilyId());
            return "redirect:/fridge";
        } catch (Exception e) {
            log.error("An error occurred during modification: {}", e.getMessage(), e);
            return "error-page";
        }
    }


    @ResponseBody
    @PostMapping("/delete/{foodId}")
    public String deleteFridgeFood(@PathVariable int foodId) {
    	log.debug("정상적으로 작동 하나요? : {}",foodId);
        fridgeFoodService.deleteFridgeFood(foodId);
        return "success";
    }
    
    @ResponseBody
    @GetMapping("getFridgeFoods/{fridgeId}")
    public List<FridgeFood> getFridgeFoods(@PathVariable int fridgeId) {
        // FridgeService 또는 관련 서비스를 사용하여 해당 냉장고의 음식 목록을 가져옵니다.
        return fridgeFoodService.getFoodsByFridgeId(fridgeId);
    }

    @ResponseBody
    @GetMapping("/getAllFoodsByCategory/{category}")
    public List<FridgeFood> getAllFoodsByCategory(@PathVariable String category) {
        return fridgeFoodService.getAllFoodsByCategory(category);
    }

}