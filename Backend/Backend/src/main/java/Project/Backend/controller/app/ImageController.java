package Project.Backend.controller.app;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.entity.QuestionList;
import Project.Backend.repository.QuestionListRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/image-display")
public class ImageController {

    private final String imageStoragePath = "src/main/resources/static/images/";

    @Autowired
    private QuestionListRepository questionListRepository;

    @GetMapping("/storedImages")
    public ResponseEntity<?> getStoredImages(@RequestParam("themeId") String themeId) {
        if (themeId == null || themeId.isEmpty()) {
            return ResponseEntity.badRequest().body("themeId가 필요합니다.");
        }
        List<QuestionList> questions = questionListRepository.findByStageLevelStartingWithAndType(themeId, "word");
        List<Map<String, String>> imageList = new ArrayList<>();

        for (QuestionList question : questions) {
            String[] words = question.getQuestion().split(",");
            for (String word : words) {
                String sanitizedWord = sanitizeFileName(word.trim());
                String imageName = sanitizedWord + ".png";
                Path imagePath = Paths.get(imageStoragePath + imageName);
                File imageFile = imagePath.toFile();

                if (imageFile.exists()) {
                    imageList.add(Map.of(
                        "prompt", word.trim(),
                        "imageUrl", "/api/image-display/images/" + imageName,
                        "result", question.getResult()
                    ));
                }
            }
        }
        return imageList.isEmpty() 
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(imageList);
    }

    private String sanitizeFileName(String input) {
        return input.replaceAll("[\\\\/:*?\"<>|]", ""); 
    }
    
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(imageStoragePath + filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"");
                return ResponseEntity.ok().headers(headers).contentType(MediaType.IMAGE_PNG).body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
