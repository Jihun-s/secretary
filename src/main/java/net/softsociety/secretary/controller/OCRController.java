package net.softsociety.secretary.controller;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class OCRController {

    @PostMapping("/detect-text")
    public String detectText(@RequestParam("file") MultipartFile file) throws IOException {
        List<AnnotateImageRequest> requests = new ArrayList<>();
        ByteString imgBytes = ByteString.readFrom(file.getInputStream());
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