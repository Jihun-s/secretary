package net.softsociety.secretary.security;

import java.sql.Timestamp;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
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
public class logEventListener implements ApplicationListener<AbstractAuthenticationEvent> {
    @Autowired
    private UserService userService;
    @Autowired
    private LogRepository logRepository;
    @Autowired
    private LogService logService;

    @Override
    public void onApplicationEvent(AbstractAuthenticationEvent event) {
        // 로그인 및 로그아웃 이벤트 처리
        if (event instanceof AuthenticationSuccessEvent) {
            handleLoginEvent((AuthenticationSuccessEvent) event);
        } else if (event instanceof LogoutSuccessEvent) {
            handleLogoutEvent((LogoutSuccessEvent) event);
        }
    }

    private void handleLoginEvent(AuthenticationSuccessEvent event) {
        // 로그인 로그 기록
        String userEmail = event.getAuthentication().getName();
        log.debug("로그인 성공 - 사용자: {}", userEmail);
        User user = userService.findByEmailOrUserId(userEmail);
        Log log = new Log();
        log.setUserId(user.getUserId());
        log.setLogIp(getUserIpAddress());
        log.setLogin(new Timestamp(System.currentTimeMillis()));
        log.setLogMessage("로그인이 발생하였습니다");
        logService.saveLog(log);
    }

    private void handleLogoutEvent(LogoutSuccessEvent event) {
        // 로그아웃 로그 기록
        String userEmail = event.getAuthentication().getName();
        log.debug("로그아웃 - 사용자: {}", userEmail);
        User user = userService.findByEmailOrUserId(userEmail);
        Log log = new Log();
        log.setUserId(user.getUserId());
        log.setLogIp(getUserIpAddress());
        log.setLogout(new Timestamp(System.currentTimeMillis()));
        log.setLogMessage("로그아웃이 발생하였습니다");
        logService.saveLog(log);
    }

    private String getUserIpAddress() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        return request.getRemoteAddr();
    }
}
