package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Weather {
    private String name; // 도시 이름
    private Main main; // 기온, 습도 등의 정보

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Main {
        private double temp; // 기온
        private double humidity; // 습도
    }
}
