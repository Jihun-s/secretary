package net.softsociety.secretary.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList("일반", "야채", "육류", "생선", "과일", "사용자 입력", "custom"); // ... 등등 추가 가능

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
}