package net.softsociety.secretary.domain;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String userId;
    private String userEmail;
    private String userName;
    private String userNickname;
    private String userPw;
    private String userProfileimg;
    private int enabled;
    private String rolename;
    private Long familyId;
    private String birthday;
    private int sex;
    private String verificationToken;
}
