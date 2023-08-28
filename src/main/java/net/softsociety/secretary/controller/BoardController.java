package net.softsociety.secretary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.BoardDAO;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.BoardService;
import net.softsociety.secretary.service.UserService;

@Controller
@Slf4j
@RequestMapping("board")
public class BoardController {
	@Autowired
	BoardService service;
	@Autowired
	UserService userservice;
	@Autowired
	BoardDAO dao;
	
	//글목록으로 이동
	@GetMapping("list")
	public String list() {
		return "boardView/list";
	}	
	//게시글목록
	@ResponseBody
	@GetMapping("getList")
	public ArrayList<Board> getList() {
		ArrayList<Board> boardList = dao.selectAllBoard();
		log.debug("cont : {}", boardList);
		return boardList;
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
    	User u = userservice.findByEmail(user.getUsername());    	
    	
    	b.setUserId(u.getUserId());
    	
    	String boardCategory1 = "inquiry";
    	b.setBoardCategory1(boardCategory1);
    	log.debug("cont : {}", b);
    	service.write(b);
	    return "redirect:/board/list";
    }
//   //문의 글 읽기
//    @ResponseBody
//    @GetMapping("read")
//    public String read(@RequestParam(name="boardId",defaultValue="0")int boardId, Model m) {
//    	Board b = service.read(boardId);
//    	if (b == null) {
//            return "redirect:/board/list";
//        }
//    	m.addAttribute("Board", b);
//    	log.debug("userId : {}", b.getUserId());
//    	return "boardView/read";
//    }
    //문의 글 읽기
    @ResponseBody
    @GetMapping("read")
    public ResponseEntity<Board> read(@RequestParam int boardId) {
    	Board readContent = service.getboardContent(boardId);
        if (readContent != null) {
            return ResponseEntity.ok(readContent);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    // 글 수정 페이지로 이동
    @GetMapping("update/{boardId}")
    public String showUpdateForm(@PathVariable int boardId, Model model) {
        Board board = service.getboardContent(boardId);
        model.addAttribute("board", board);
        return "boardView/update"; 
    }
    
    //글 삭제
    @GetMapping("deleteBoard")
    public String deleteBoard(@RequestParam int boardId) {
    	int n = service.deleteBoard(boardId);
    	
    	 log.debug("deleteBoard:/ {}", boardId);
    	
    	 if(n==0) {
	         log.debug("삭제 실패");
	         return "redirect:/";
	      }
    	 return "redirect:list";
    }
}
