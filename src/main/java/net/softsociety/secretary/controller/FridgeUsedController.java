package net.softsociety.secretary.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeUsed;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.FridgeUsedService;

@Slf4j
@Controller
@RequestMapping("/fridgeUsed")
public class FridgeUsedController {

	@Autowired
	private FridgeUsedService fridgeUsedService;
	
	@ResponseBody
	@PostMapping("/consumeFood")
	public ResponseEntity<?> consumeFood(@RequestBody FridgeFood fridgeFood) {
		try {
	    	fridgeUsedService.consumeFood(fridgeFood);
	        return new ResponseEntity<>(HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@ResponseBody
	@GetMapping("/consumptionHistory")
    public List<FridgeUsed> getConsumptionHistory() {
        return fridgeUsedService.getUsedFoodsHistory();
    }
	
	@ResponseBody
	@GetMapping("/getFoodsNotAccessedForDays")
	public Map<String, List<FridgeFood>> getFoodsNotAccessedForDays() {
	    List<FridgeFood> foods15Days = fridgeUsedService.getFoodsNotAccessedForDays(15);
	    List<FridgeFood> foods30Days = fridgeUsedService.getFoodsNotAccessedForDays(30);

	    foods30Days.removeAll(foods15Days);  // 15일 이상 사용되지 않은 음식을 30일 리스트에서 제거

	    Map<String, List<FridgeFood>> resultMap = new HashMap<>();
	    resultMap.put("foods15Days", foods15Days);
	    resultMap.put("foods30Days", foods30Days);

	    return resultMap;
	}

	@ResponseBody
	@PostMapping("deleteConsumptionHistory")
	public ResponseEntity<String> deleteConsumptionHistory(@RequestParam int fridgeUsedId) {
        try {
            int rowsAffected = fridgeUsedService.deleteById(fridgeUsedId);
            if (rowsAffected > 0) {
                return ResponseEntity.ok("소비 이력이 삭제되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("해당 ID의 소비 이력이 존재하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("소비 이력 삭제에 실패하였습니다.");
        }
    }
	
	@ResponseBody
	@PostMapping("/deleteAllConsumptionHistory")
	public ResponseEntity<String> deleteAllConsumptionHistory(@ModelAttribute("loginUser") User user) {
	    try {
	    	fridgeUsedService.deleteAll(user.getFamilyId());
	        return ResponseEntity.ok("모든 소비 이력이 삭제되었습니다.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("소비 이력 전체 삭제에 실패하였습니다.");
	    }
	}
}
