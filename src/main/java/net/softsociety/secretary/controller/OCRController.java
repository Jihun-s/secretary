package net.softsociety.secretary.controller;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class OCRController {

    private static final int MAX_SIZE_MB = 10;

    @PostMapping("/detect-text")
    public String detectText(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();

        // 10MB를 초과하면 압축
        if (fileBytes.length > MAX_SIZE_MB * 1024 * 1024) {
            // 이미지 압축
            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(fileBytes));
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "jpg", byteArrayOutputStream);
            fileBytes = byteArrayOutputStream.toByteArray();
            // 압축 품질을 조정하고 싶으면 이미지 작성 로직을 별도로 구현해야 함.
        }

        List<AnnotateImageRequest> requests = new ArrayList<>();
        ByteString imgBytes = ByteString.copyFrom(fileBytes);
        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            List<AnnotateImageResponse> responses = client.batchAnnotateImages(requests).getResponsesList();
            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    return "Error: " + res.getError().getMessage();
                }

                return "Text: " + res.getTextAnnotationsList().get(0).getDescription();
            }
        }

        return "No text detected";
    }
}
