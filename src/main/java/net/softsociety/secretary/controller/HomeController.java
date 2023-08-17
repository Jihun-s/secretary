package net.softsociety.secretary.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class HomeController {

	/**
	 * 메인화면
	 */
	@GetMapping({"", "/"})
    public void redirectToNewUrl(HttpServletResponse response) throws IOException {
        response.sendRedirect("/secretary/html/index.html");
    }
	
	
}
