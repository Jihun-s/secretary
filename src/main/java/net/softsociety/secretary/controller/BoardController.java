package net.softsociety.secretary.controller;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.rpc.context.AttributeContext.Request;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.BoardDAO;
import net.softsociety.secretary.domain.Answer;
import net.softsociety.secretary.domain.Board;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.service.AnswerService;
import net.softsociety.secretary.service.BoardService;
import net.softsociety.secretary.service.UserService;
import net.softsociety.secretary.util.PageNavigator;

@Controller
@Slf4j
@RequestMapping("board")
public class BoardController {
	
	@Autowired
	BoardService service;
	@Autowired
	UserService userservice;
	@Autowired
	AnswerService Aservice;
	@Autowired
	BoardDAO dao;
	
	@Value("${spring.servlet.multipart.location}")
	String uploadPath;
	
	//게시판 목록의 페이지당 글 수
	@Value("${user.board.page}")
	int countPerPage;
		
	//게시판 목록의 페이지 이동 링크 수
	@Value("${user.board.group}")
	int pagePerGroup;
	
	//글목록 불러오기
	@GetMapping("list")
	public String list (Model m, @RequestParam(name="boardCategory2", defaultValue="all")String boardCategory2,
						@RequestParam(name = "boardCategory1", defaultValue = "inquiry") String boardCategory1,
						@RequestParam(name="page", defaultValue="1")int page ) {
		PageNavigator navi = service.getPageNavigator(pagePerGroup, countPerPage, page, boardCategory1, boardCategory2);
		
		ArrayList<Board> list = service.getBoardList(navi, boardCategory1, boardCategory2);
		
		m.addAttribute("list", list);
		m.addAttribute("navi", navi);
		m.addAttribute("boardCategory1",boardCategory1);
		m.addAttribute("boardCategory2",boardCategory2);
		
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
    	User u = userservice.findByEmailOrUserId(user.getUsername());    	
    	
    	b.setUserId(u.getUserId());
    	
    	log.debug("cont : {}", b);
    	service.write(b);
	    return "redirect:/board/list";
    }
    //문의 글 읽기
    @GetMapping("read")
    public String read(@RequestParam(name="boardId", defaultValue="0") int boardId, Model model) {
    	
    	Board b = service.read(boardId);
    	
    	ArrayList<Answer> answer = Aservice.read(boardId);
    	
    	if(b ==null) {
			return "redirect:/list";
		}
    	model.addAttribute("board", b);
    	
    	if(answer != null && !answer.isEmpty()) {
    		model.addAttribute("answer", answer);
    	} 	    	
    	return "boardView/read";
    	
    }
    //수정 폼 이동
    @GetMapping("update")
    public String update(String boardId, Model m) {
    	int num = (boardId != null && !boardId.isEmpty()) ? Integer.parseInt(boardId) : 0;
    	log.debug("num 여기요여기요 : {}", num);
    	Board b = service.upread(num);
    	
    	m.addAttribute("b", b);
    	
    	return "boardView/update";
    }
    //문의 글 수정
    @PostMapping("update")
    public String update(@AuthenticationPrincipal UserDetails user,Board b){
    	User u = userservice.findByEmailOrUserId(user.getUsername());
    	
    	b.setUserId(u.getUserId());
    	
    	service.update(b);
    	
    	return "redirect:/board/list";
    }
    //문의 글 삭제
    @GetMapping("deleteOne")
    public String deleteOne(int boardId) {
    	log.debug("deleteOne : {}", boardId);
    	int n = service.deleteOne(boardId);
    	
    	if(n==0) {
    		log.debug("삭제실패");
    		return "redirect:/board/read?boardId=" + boardId;
    	}
    	return "redirect:/board/list";
    }

    //답글삭제
    @GetMapping("deleteAnswer")
    public String deleteAnswer(Answer answer) {
    	int answerId = answer.getAnswerId();
    	int boardId = answer.getBoardId();
    	
    	log.debug("@@deleteAnswer@@ - answerId: {}, boardId: {}", answerId, boardId);

        int n = Aservice.deleteAnswer(answerId);
        n = service.updateBoardStatusToFalse(boardId);

        return "redirect:/board/list";
    }
    //답글 달기
    @PostMapping("answer")
    public String answer(@AuthenticationPrincipal UserDetails user, Answer answer) {
    	User u = userservice.findByEmailOrUserId(user.getUsername()); 
    	
    	answer.setUserId(u.getUserId());    	
    	
    	int n = Aservice.insertAnswer(answer);
    	// 답글이 추가된 후, 해당 게시글의 상태를 업데이트
        int boardId = answer.getBoardId(); 
        service.updateBoardStatus(boardId);
    	
    	return "redirect:/board/read?boardId="+boardId + "&reload=true";
    }

    
    
   
    
    
}
