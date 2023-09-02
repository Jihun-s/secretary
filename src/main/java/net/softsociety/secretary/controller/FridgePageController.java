package net.softsociety.secretary.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Fridge;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.FridgeService;
import net.softsociety.secretary.service.UserService;

@Slf4j
@Controller
@RequestMapping("/fridge")
public class FridgePageController {

	@Autowired
	private FridgeService fridgeService;
	
    @Autowired
    private UserService userService;
	
	// 냉장고 메인화면
	@GetMapping({"", "/"})
	public String fridgeMain() {
		
		return "fridgeView/fridgeMain";
	}
	
	// 냉장고 상세1
	@GetMapping("1")
	public String fridge1() {
		
		return "fridgeView/fridge1";
	}
	
	// 냉장고 상세2
	@GetMapping("2")
	public String fridge2() {
		
		return "fridgeView/fridge2";
	}

	@ResponseBody
    @GetMapping("getAllFridges")
    public List<Fridge> getAllFridges(Principal principal) {
        // Principal 객체를 사용하여 현재 인증된 사용자의 이름을 가져옵니다.
        String username = principal.getName();

        // UserService를 사용하여 User 객체를 검색합니다.
        User user = userService.findByEmailOrUserId(username);

        // User 객체에서 family_id를 가져옵니다.
        int familyId = user.getFamilyId();
        return fridgeService.getAllFridges(familyId);
    }

	@ResponseBody
	@PostMapping("addFridge")
	public ResponseEntity<?> addFridge(@RequestBody Fridge fridge, Principal principal) {
	    try {
		    // Principal 객체를 사용하여 현재 인증된 사용자의 이름을 가져옵니다.
		    String username = principal.getName();

		    // UserService를 사용하여 User 객체를 검색합니다.
		    User user = userService.findByEmailOrUserId(username);

		    // User 객체에서 family_id를 가져옵니다.
		    int familyId = user.getFamilyId();

		    // Fridge 객체에 family_id를 설정합니다.
		    fridge.setFamilyId(familyId);
			
		    List<Integer> newFridgeIds = fridgeService.addFridge(fridge);
		    
		    
	        return new ResponseEntity<>(newFridgeIds, HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

    @PutMapping("/{id}")
    public Fridge updateFridge(@PathVariable int id, @RequestBody Fridge fridge) {
        return fridgeService.updateFridge(id, fridge);
    }

    @DeleteMapping("/{id}")
    public void deleteFridge(@PathVariable int id) {
        fridgeService.deleteFridge(id);
    }
}
