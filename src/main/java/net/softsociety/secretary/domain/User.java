package net.softsociety.secretary.domain;

import java.time.LocalDateTime;
import java.util.Collection;

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
	private int enabled;
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
        return enabled == 1;
    }
    
}
