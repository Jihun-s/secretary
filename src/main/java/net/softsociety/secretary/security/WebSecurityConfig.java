package net.softsociety.secretary.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

/**
 * Security 설정
 */
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/",
                "/user/signup",
                "/user/login",
                "/user/forgotPw",
                "/user/confirm",
                "/user/idcheck",
                "/user/emailcheck",
                "/user/forgot-password",
                "/user/reset-password",
                "/user/register",
                "/user/verify",
                "/user/failed-verification",
                "/user/confirm",
                "/user/check-email",
                "/homeView/home",
                "/boardView/list",
                "/boardView/list2",
                "/boardView/write",
                "/cashbook/trans/setTrans",
                "/thymeleaf", 
                
                // static 하위 폴더들
                "/assets/**",
                "/assets2/**",
                "/css/**",
                "/fonts/**",
                "/fridgeimg/**",
                "/images/**",
                "/js/**",
                "/libs/**",
                "/scss/**",
                "/tasks/**",
                "/fridgeFood/image/**"
                    ).permitAll()
            .antMatchers("/admin").hasAuthority("ROLE_ADMIN")
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .loginPage("/user/login")
            .loginProcessingUrl("/user/login").permitAll()
            .usernameParameter("emailOrUserId")
            .passwordParameter("userPw")
            .and()
            .rememberMe() // 여기로 이동
            .key("uniqueAndSecret") // 암호화 키 설정
            .tokenValiditySeconds(30 * 24 * 60 * 60) // 토큰 유효기간 (초 단위)
            .tokenRepository(persistentTokenRepository(dataSource)) // 위에서 정의한 빈 사용
            .and()
            .logout()
            .logoutUrl("/user/logout")
            .logoutSuccessUrl("/").permitAll()
            .and()
            .cors()
            .and()
            .httpBasic();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
    }

	@Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
    
    @Bean
    public PersistentTokenRepository persistentTokenRepository(DataSource dataSource) {
        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
        tokenRepository.setDataSource(dataSource);
        return tokenRepository;
    }

}