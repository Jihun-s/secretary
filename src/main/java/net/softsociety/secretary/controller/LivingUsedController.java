package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.LivingGoods;
import net.softsociety.secretary.domain.LivingUsed;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.LivingUsedService;

@Slf4j
@Controller
@RequestMapping("/livingUsed")
public class LivingUsedController {
	
	@Autowired
	private LivingUsedService livingUsedService;
	
	@ResponseBody
	@PostMapping("/consumeItem")
	public ResponseEntity<?> consumeItem(@RequestBody LivingGoods livingGoods, @ModelAttribute("loginUser") User user){
		livingGoods.setFamilyId(user.getFamilyId());
		try {
			livingUsedService.consumeItem(livingGoods);
	        return new ResponseEntity<>(HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@ResponseBody
	@GetMapping("/consumptionHistory")
    public List<LivingUsed> getConsumptionHistory() {
        return livingUsedService.getUsedGoodsHistory();
    }
}
