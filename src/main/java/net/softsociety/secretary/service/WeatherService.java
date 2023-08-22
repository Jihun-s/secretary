package net.softsociety.secretary.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import net.softsociety.secretary.domain.Weather;

@Service
public class WeatherService {

    private static final String API_KEY = "b50ea02657c7315ee1e758b1b06adf48";
    private static final String URL = "http://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}";

    public Weather getWeather(String city) {
        RestTemplate restTemplate = new RestTemplate();
        String url = URL.replace("{city}", city).replace("{apiKey}", API_KEY);
        return restTemplate.getForObject(url, Weather.class);
    }
}