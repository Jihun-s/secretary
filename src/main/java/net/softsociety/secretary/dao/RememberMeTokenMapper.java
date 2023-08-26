package net.softsociety.secretary.dao;

import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.softsociety.secretary.domain.RememberMeToken;

@Mapper
public interface RememberMeTokenMapper {
    void insertToken(@Param("username") String username,
                     @Param("series") String series,
                     @Param("token") String token,
                     @Param("lastUsed") LocalDateTime lastUsed);
    
    void updateToken(@Param("series") String series,
                     @Param("token") String token,
                     @Param("lastUsed") LocalDateTime lastUsed);
    
    void deleteToken(@Param("series") String series);
    
    RememberMeToken getToken(@Param("series") String series);
}