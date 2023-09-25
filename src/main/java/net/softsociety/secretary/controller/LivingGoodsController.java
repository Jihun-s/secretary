package net.softsociety.secretary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.LivingGoods;
import net.softsociety.secretary.domain.LivingGoodsListWrapper;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.LivingGoodsService;
import net.softsociety.secretary.util.FileService;
import oracle.jdbc.proxy.annotation.Post;

@Slf4j
@Controller
@RequestMapping("/livingGoods")
public class LivingGoodsController {

	@Autowired
	private LivingGoodsService livingGoodsService;
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;// = "c:/secretary";
	
	@GetMapping({"","/"})
	public String LivingGoodsMain() {
		return "livingGoodsView/livingGoods.html";
	}
	
	// 직접 입력을 통한 개별 추가
	@PostMapping("/add")
	public String addLivingGood(@ModelAttribute LivingGoods livingGood, MultipartFile itemImage, @ModelAttribute("loginUser") User user) {
	    try {
	        if (itemImage != null && !itemImage.isEmpty()) {
	            String savedFileName = FileService.saveFile(itemImage, uploadPath);
	            livingGood.setItemOriginalFile(itemImage.getOriginalFilename());
	            livingGood.setItemSavedFile(savedFileName);
	        }
	        livingGoodsService.addLivingGood(livingGood, user.getFamilyId());
	        return "redirect:/livingGoods";
	    } catch (Exception e) {
	        log.error("An error occurred: {}", e.getMessage(), e);
	        return "error-page";
	    }
	}
	
	// 영수증을 통한 다중 추가
	@PostMapping("/addFromReceipt")
	public String addLivingGoodsFromReceipt(@ModelAttribute LivingGoodsListWrapper wrapper, @ModelAttribute("loginUser") User user) {
	    List<LivingGoods> livingGoods = wrapper.getLivingGoods();
	    try {
	        for (LivingGoods livingGood : livingGoods) {
	            livingGoodsService.addLivingGood(livingGood, user.getFamilyId());
	        }
	        return "redirect:/livingGoods";
	    } catch (Exception e) {
	        log.error("An error occurred: {}", e.getMessage(), e);
	        return "error-page";
	    }
	}
	
	@GetMapping("/getLivingGoods")
	public ResponseEntity<List<LivingGoods>> getLivingGoods() {
        List<LivingGoods> livingGoods = livingGoodsService.getLivingGoods();
        return new ResponseEntity<>(livingGoods, HttpStatus.OK);
    }
	
    // 아이템 가져오기
    @ResponseBody
    @GetMapping("/item/{itemId}")
    public LivingGoods getGoodsDetails(@PathVariable int itemId) {
        return livingGoodsService.getGoodsDetails(itemId);
    }
    
    @PostMapping("/modify/{itemId}")
    public String modifyLivingGood(@PathVariable int itemId, @ModelAttribute LivingGoods livingGoods, MultipartFile itemImage, @ModelAttribute("loginUser") User user) {
        try {
            // 이미지 변경 로직
            if (itemImage != null && !itemImage.isEmpty()) {
                String savedFileName = FileService.saveFile(itemImage, uploadPath);
                livingGoods.setItemOriginalFile(itemImage.getOriginalFilename());
                livingGoods.setItemSavedFile(savedFileName);
            }
            livingGoods.setItemId(itemId);

            livingGoodsService.modifyLivingGood(livingGoods, user.getFamilyId());
            return "redirect:/livingGoods";  // 리다이렉트 경로는 실제 경로에 맞게 수정해주세요.
        } catch (Exception e) {
            log.error("An error occurred during modification: {}", e.getMessage(), e);
            return "error-page";
        }
    }
    
    @ResponseBody
    @PostMapping("/delete/{itemId}")
    public String deleteLivingGoods(@PathVariable int itemId) {
        livingGoodsService.deleteLivingGoods(itemId);
        return "success";
    }

}
