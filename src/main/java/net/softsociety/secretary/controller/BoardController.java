package net.softsociety.secretary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.service.BoardService;

@Controller
@Slf4j
@RequestMapping("board")
public class BoardController {
	@Autowired
	BoardService service;
	
	//게시글목록으로 이동
	@GetMapping("list")
	public String list() {
		return "boardView/list";
	}
	
	//1:1 문의글 등록으로 이동
	@GetMapping("write")
	public String write() {
		return "boardView/write";
	}
	// 취소 버튼 클릭 시 리다이렉트
    @GetMapping("cancel")
    public String cancel() {
        return "redirect:/board/list"; 
    }
    //문의 글 등록
    @PostMapping("write")
    public String write(@AuthenticationPrincipal UserDetails user
			            ,Board b) {
    	b.setUserId(user.getUsername());
    	
    	String boardCategory2 = b.getBoardCategory2();
    	
    	service.write(b);
	    return "redirect:/board/list";
    }
}
