package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.softsociety.secretary.domain.FoodCategory;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.FoodCategoryService;

@RestController
@RequestMapping("/foodCategories")
public class FoodCategoryController {
    @Autowired
    private FoodCategoryService foodCategoryService;

    @PostMapping
    public int addCategory(@RequestBody FoodCategory foodCategory, @ModelAttribute("loginUser") User user) {
        foodCategory.setFamilyId(user.getFamilyId()); // Set familyId before adding the category
        return foodCategoryService.addCategory(foodCategory);
    }

    @GetMapping
    public ResponseEntity<List<FoodCategory>> getAllCategoriesByFamily(@ModelAttribute("loginUser") User user) {
        return ResponseEntity.ok(foodCategoryService.getAllCategoriesByFamily(user.getFamilyId()));
    }
}