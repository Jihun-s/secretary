package net.softsociety.secretary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestLinkController {
	
    //OCR테스트
    @GetMapping("/ocrtest")
    public String ocrTest() {
        return "testLinkView/ocrTest";
    }

    //Voice테스트
    @GetMapping("/speechtest")
    public String speechTest() {
        return "testLinkView/speechTest";
    }
    
    //Login테스트
    @GetMapping("/auth-login-basic")
    public String authLoginBasic() {
        return "auth-login-basic";
    }
    
    //Calender 테스트
	@GetMapping("month_view")
	public String month_view() {
		return "testLinkView/month-view";
	}
	
	//SNS공유_API 테스트
	@GetMapping("snsShare")
	public String sns_Share() {
		return "testLinkView/snsShareTest";
	}
}
