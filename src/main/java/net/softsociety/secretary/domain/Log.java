package net.softsociety.secretary.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private Date login;
    
    @Column(name = "logout")
    private Date logout;
    
    @Column(name = "log_ip", nullable = false)
    private String logIp;
    
    @Column(name = "log_message", length = 255)
    private String logMessage;
    
    //private Date timeStamp;
}