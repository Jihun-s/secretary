package net.softsociety.secretary.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.domain.FridgeUsed;
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
	    log.debug("컨트롤러시점 : {}", fridgeFood);
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
		List<FridgeUsed> fff = fridgeUsedService.getUsedFoodsHistory();
		log.debug("왜 또 안돼 왜 매번 안돼 : {}",fff);
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

}
