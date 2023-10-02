package net.softsociety.secretary.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FoodCategory;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.FoodCategoryService;

@Slf4j
@RestController
@RequestMapping("/foodCategories")
public class FoodCategoryController {
    @Autowired
    private FoodCategoryService foodCategoryService;

 // 미리 지정된 default 카테고리 목록
    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList("일반", "야채", "육류", "해산물", "과일", "사용자 입력", "custom"); // ... 등등 추가 가능

    @PostMapping
    public int addCategory(@RequestBody FoodCategory foodCategory, @ModelAttribute("loginUser") User user) {
        // 미리 지정된 default 카테고리인지 확인
        if (DEFAULT_CATEGORIES.contains(foodCategory.getFoodCategory())) {
            // Default 카테고리를 추가하려고 할 때 오류 코드 반환 (예: -1)
            return -1;
        }

        foodCategory.setFamilyId(user.getFamilyId()); // Set familyId before adding the category
        return foodCategoryService.addCategory(foodCategory);
    }

    @GetMapping
    public ResponseEntity<List<FoodCategory>> getAllCategoriesByFamily(@ModelAttribute("loginUser") User user) {
        return ResponseEntity.ok(foodCategoryService.getAllCategoriesByFamily(user.getFamilyId()));
    }
    
    @PostMapping("/updateCategory")
    public ResponseEntity<?> updateCategory(@RequestParam String originalName, @RequestParam String newName, @ModelAttribute("loginUser") User user) {
    	try {
            foodCategoryService.updateCategory(originalName, newName, user.getFamilyId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 카테고리 중복 확인 엔드포인트
    @PostMapping("/checkCategoryDuplication")
    public ResponseEntity<?> checkCategoryDuplication(@RequestBody FoodCategory foodCategory, @ModelAttribute("loginUser") User user) {
    	foodCategory.setFamilyId(user.getFamilyId());
        boolean isDuplicated = foodCategoryService.checkCategoryDuplication(foodCategory);
        return new ResponseEntity<>(isDuplicated, HttpStatus.OK);
    }

    // 해당 카테고리를 사용하는 음식 수 확인 엔드포인트
    @PostMapping("/countFoodsUsingCategory")
    public ResponseEntity<Integer> countFoodsUsingCategory(@RequestBody FoodCategory foodCategory, @ModelAttribute("loginUser") User user) {
    	foodCategory.setFamilyId(user.getFamilyId());
        int count = foodCategoryService.countFoodsUsingCategory(foodCategory);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    //삭제 기능
    @PostMapping("/deleteCategory")
    public ResponseEntity<?> deleteCategory(@RequestParam String foodCategory, @ModelAttribute("loginUser") User user) {
        try {
            foodCategoryService.deleteCategory(foodCategory, user.getFamilyId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}