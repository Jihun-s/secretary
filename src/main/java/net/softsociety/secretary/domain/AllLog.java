package net.softsociety.secretary.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AllLog {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "secretary_logstat_seq")
	@Column(name = "log_id")
	private int logId;

	@Column(name = "user_id", nullable = false)
	private String userId;

	@Column(name = "log_action")
	private String logAction;

	@Column(name = "log_time")
	private String logTime;

	@Column(name = "log_ip", nullable = false)
	private String logIp;

	@Column(name = "log_message", length = 255)
	private String logMessage;

	@Column(name = "log_data")
	private String logData;	
	String loginData;
}
