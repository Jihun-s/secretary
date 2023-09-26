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
import net.softsociety.secretary.domain.LivingCategory;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.LivingCategoryService;
import oracle.jdbc.proxy.annotation.Post;

@Slf4j
@RestController
@RequestMapping("/livingCategories")
public class LivingCategoryController {

	@Autowired
	private LivingCategoryService livingCategoryService;
	
    @GetMapping
    public ResponseEntity<List<LivingCategory>> getAllCategoriesByFamily(@ModelAttribute("loginUser") User user) {
        return ResponseEntity.ok(livingCategoryService.getAllCategoriesByFamily(user.getFamilyId()));
    }
    
    // 미리 지정된 default 카테고리 목록
    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList("욕실용품", "주방용품", "청소용품", "세탁용품", "일반물품", "사용자 입력", "custom"); // ... 등등 추가 가능

    @PostMapping
    public int addCategory(@RequestBody LivingCategory itemCategory, @ModelAttribute("loginUser") User user) {
        // 미리 지정된 default 카테고리인지 확인
        if (DEFAULT_CATEGORIES.contains(itemCategory.getItemCategory())) {
            // Default 카테고리를 추가하려고 할 때 오류 코드 반환 (예: -1)
            return -1;
        }

        itemCategory.setFamilyId(user.getFamilyId()); // Set familyId before adding the category
        return livingCategoryService.addCategory(itemCategory);
    }
    
    // 카테고리 중복 확인
    @PostMapping("/checkCategoryDuplication")
    public ResponseEntity<?> checkCategoryDuplication(@RequestBody LivingCategory livingCategory, @ModelAttribute("loginUser") User user) {
    	livingCategory.setFamilyId(user.getFamilyId());
    	boolean isDuplicated = livingCategoryService.checkCategoryDuplication(livingCategory);
    	return new ResponseEntity<>(isDuplicated, HttpStatus.OK);
    }
    
    // 해당 카테고리를 사용하는 음식 수 확인 엔드포인트
    @PostMapping("/countItemsUsingCategory")
    public ResponseEntity<Integer> countItemsUsingCategory(@RequestBody LivingCategory livingCategory, @ModelAttribute("loginUser") User user) {
    	livingCategory.setFamilyId(user.getFamilyId());
        int count = livingCategoryService.countItemsUsingCategory(livingCategory);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // 업데이트 카테고리
    @PostMapping("/updateCategory")
    public ResponseEntity<?> updateCategory(@RequestParam String originalName, @RequestParam String newName, @ModelAttribute("loginUser") User user) {
    	log.debug("일단체크하겠습니다 originalName: {},newName : {}",originalName,newName);
    	try {
            livingCategoryService.updateCategory(originalName, newName, user.getFamilyId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 삭제 기능
    @PostMapping("/deleteCategory")
    public ResponseEntity<?> deleteCategory(@RequestParam String itemCategory, @ModelAttribute("loginUser") User user){
    	try {
    		livingCategoryService.deleteCategory(itemCategory, user.getFamilyId());
    		return new ResponseEntity<>(HttpStatus.OK);
    	} catch(Exception e) {
    		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
}
