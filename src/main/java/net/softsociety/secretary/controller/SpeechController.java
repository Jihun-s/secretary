package net.softsociety.secretary.controller;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
//@CrossOrigin(origins = "*")
public class SpeechController {

    @PostMapping("/transcribe")
    public String transcribe(@RequestParam("file") MultipartFile file) throws IOException {
    	log.info("Received file with size: {}", file.getSize());
        RecognitionConfig config = RecognitionConfig.newBuilder()
                .setLanguageCode("ko-KR") // 언어 설정 변경 가능
                .build();
        ByteString audioBytes = ByteString.readFrom(file.getInputStream());
        RecognitionAudio audio = RecognitionAudio.newBuilder().setContent(audioBytes).build();

        try (SpeechClient speechClient = SpeechClient.create()) {
            RecognizeResponse response = speechClient.recognize(config, audio);

            // 결과가 있는지 확인
            if (response.getResultsList().isEmpty()) {
                return "음성이 인식되지 않았습니다.";
            }

            SpeechRecognitionResult result = response.getResultsList().get(0);
            return result.getAlternativesList().get(0).getTranscript();
        }
    }
}
