package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.RememberMeTokenMapper;
import net.softsociety.secretary.domain.RememberMeToken;

@Service
public class RememberMeTokenService {

    private final RememberMeTokenMapper rememberMeTokenMapper;

    @Autowired
    public RememberMeTokenService(RememberMeTokenMapper rememberMeTokenMapper) {
        this.rememberMeTokenMapper = rememberMeTokenMapper;
    }

    public void insertToken(RememberMeToken token) {
        rememberMeTokenMapper.insertToken(token.getUsername(), token.getSeries(), token.getToken(), token.getLastUsed());
    }

    public void updateToken(RememberMeToken token) {
        rememberMeTokenMapper.updateToken(token.getSeries(), token.getToken(), token.getLastUsed());
    }

    public void deleteToken(String series) {
        rememberMeTokenMapper.deleteToken(series);
    }

    public RememberMeToken getToken(String series) {
        return rememberMeTokenMapper.getToken(series);
    }
}