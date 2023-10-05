package net.softsociety.secretary.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "secretary_logstat")
@SequenceGenerator(name = "secretary_logstat_seq", sequenceName = "secretary_logstat_seq", allocationSize = 1)
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "secretary_logstat_seq")
    @Column(name = "log_id")
    private int logId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "login")
    private Timestamp login;
    
    @Column(name = "logout")
    private Timestamp logout;
    
    @Column(name = "log_ip", nullable = false)
    private String logIp;
    
    @Column(name = "log_message", length = 255)
    private String logMessage;
    
    //private Date timeStamp;
    
    @Transient // 이 필드는 데이터베이스와 매핑하지 않음
    private int dailyLoginCount;

    public int getDailyLoginCount() {
        return dailyLoginCount;
    }

    public void setDailyLoginCount(int dailyLoginCount) {
        this.dailyLoginCount = dailyLoginCount;
    }
    @Transient
    public String loginDate;
    
    public String getLoginDate() {
    	return loginDate;
    }
    @Transient
    public String loginHour;
    
    public String getLoginHour() {
    	return loginHour;
    }
    
    @Transient
    public String loginCount;
    
    public String getLoginCount() {
    	return loginCount;
    }
//    @Transient
//    public String loginTime;
//    
//    public String getLoginTime() {
//    	return loginTime;
//    }
//    @Transient
//    public String logoutTime;
//    
//    public String getLogoutTime() {
//    	return logoutTime;
//    }
    
    
}

