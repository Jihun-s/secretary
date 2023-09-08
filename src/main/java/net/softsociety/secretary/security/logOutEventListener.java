package net.softsociety.secretary.security;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.domain.Log;
import net.softsociety.secretary.domain.User;
import net.softsociety.secretary.repository.LogRepository;
import net.softsociety.secretary.service.LogService;
import net.softsociety.secretary.service.UserService;

@Component
@Slf4j
public class logOutEventListener implements ApplicationListener<LogoutSuccessEvent> {
    @Autowired
    private UserService userservice;
    @Autowired
    private LogRepository logRepository;
    @Autowired
    private LogService logservice;

    @Override
    public void onApplicationEvent(LogoutSuccessEvent event) {
        // 로그아웃 로그 기록
        String userEmail = event.getAuthentication().getName();
        log.debug("로그아웃 성공 - 사용자: {}", userEmail);
        User user = userservice.findByEmailOrUserId(userEmail);
        Log log = new Log();
        log.setUserId(user.getUserId());
        log.setLogIp(getUserIpAddress());
        log.setLogin(new Date());
        log.setLogMessage("로그아웃이 발생하였습니다");
        logservice.saveLog(log);
    }

    private String getUserIpAddress() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        return request.getRemoteAddr();
    }
}