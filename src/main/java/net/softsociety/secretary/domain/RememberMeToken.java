package net.softsociety.secretary.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RememberMeToken {
    private String username;
    private String series;
    private String token;
    private LocalDateTime lastUsed;
}