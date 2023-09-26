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
	
	@ResponseBody
	@GetMapping("/getLivingGoodsNotAccessedForDays")
	public Map<String, List<LivingGoods>> getLivingGoodsNotAccessedForDays() {
	    List<LivingGoods> goods15Days = livingUsedService.getLivingGoodsNotAccessedForDays(15);
	    List<LivingGoods> goods30Days = livingUsedService.getLivingGoodsNotAccessedForDays(30);

	    goods30Days.removeAll(goods15Days);  // 15일 이상 사용되지 않은 제품을 30일 리스트에서 제거

	    Map<String, List<LivingGoods>> resultMap = new HashMap<>();
	    resultMap.put("goods15Days", goods15Days);
	    resultMap.put("goods30Days", goods30Days);

	    return resultMap;
	}
	
	@ResponseBody
	@PostMapping("/deleteConsumptionHistory")
	public ResponseEntity<String> deleteConsumptionHistory(@RequestParam int livingUsedId) {
	    try {
	    	int rowsAffected = livingUsedService.deleteById(livingUsedId);
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
	        livingUsedService.deleteAll(user.getFamilyId());
	        return ResponseEntity.ok("모든 소비 이력이 삭제되었습니다.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("모든 소비 이력 삭제에 실패하였습니다.");
	    }
	}

}
