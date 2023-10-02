package net.softsociety.secretary.util;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/** 
 * 가계부 알림 스케줄링 클래스
 * */

@SpringBootApplication
@EnableScheduling // 스케줄링 활성화 
@MapperScan("net.softsociety.secretary.dao")
public class CashbookAlertScheduling {
	public static void main(String[] args) {
		
		SpringApplication.run(CashbookAlertScheduling.class, args);
	}
}