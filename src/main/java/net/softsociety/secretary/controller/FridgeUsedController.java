package net.softsociety.secretary.controller;

import java.util.List;

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
}
