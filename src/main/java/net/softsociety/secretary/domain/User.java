package net.softsociety.secretary.domain;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails{
	
	private String userId;
	private String userEmail;
	private String userName;
	private String userNickname;
	private String userPw;
	private String userProfileimg;
	private boolean enabled;
	private String rolename;
	private int familyId;
	private String birthday;
	private int sex;
	private String verificationToken;
	private LocalDateTime verificationTokenExpiryDate;
	
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return userPw;
    }

    @Override
    public String getUsername() {
        return userEmail;
    }
    
    public String getUserRealName() {
    	return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 항상 true로 수정
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 항상 true로 수정
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 항상 true로 수정
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
    //생일 yyyyMMDD 형식으로 수정
    public String formatBirthday() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date parsedDate = null;
        try {
            parsedDate = dateFormat.parse(this.birthday);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return dateFormat.format(parsedDate);
    }

}
