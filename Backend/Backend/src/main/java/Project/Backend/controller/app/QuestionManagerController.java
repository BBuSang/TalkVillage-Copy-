package Project.Backend.controller.app;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import Project.Backend.entity.QuestionList;
import Project.Backend.repository.QuestionListRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/question-manager")
public class QuestionManagerController {

    private final String API_KEY = "FPSXbe549cff4adf4ee794603a4abc858373";
    private final String TEXT_TO_IMAGE_URL = "https://api.freepik.com/v1/ai/text-to-image";
    private final String imageStoragePath = "src/main/resources/static/images/";

    @Autowired
    private QuestionListRepository questionListRepository;
    
    @PostMapping("/generate-images")
    public ResponseEntity<?> generateImages(@RequestParam("words") String words, @RequestParam("stageLevel") String stageLevel) {
        String[] wordArray = words.split(",");
        String question = String.join(",", wordArray);
        String result = wordArray[0].trim();
        String type = "word";

        QuestionList questionList = new QuestionList();
        questionList.setQuestion(question);
        questionList.setResult(result);
        questionList.setStageLevel(stageLevel);
        questionList.setType(type);
        questionListRepository.save(questionList);
        
        List<Map<String, String>> savedImages = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();

        for (String word : wordArray) {
            String prompt = "A simple, cartoon-style image of " + word;
            String requestBody = "{ \"prompt\": \"" + prompt + "\", \"image\": { \"size\": \"medium\" }, \"num_images\": 1 }";

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-freepik-api-key", API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            try {
                ResponseEntity<Map> response = restTemplate.postForEntity(TEXT_TO_IMAGE_URL, entity, Map.class);
                Map<String, Object> responseBody = response.getBody();

                if (responseBody != null && responseBody.containsKey("data")) {
                    List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
                    if (!dataList.isEmpty() && dataList.get(0).containsKey("base64")) {
                        String base64Image = (String) dataList.get(0).get("base64");

                        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
                        Path imagePath = Paths.get(imageStoragePath + word.trim() + ".png");
                        try (FileOutputStream fos = new FileOutputStream(imagePath.toFile())) {
                            fos.write(decodedBytes);
                        }

                        savedImages.add(Map.of("word", word.trim(), "imageUrl", "/images/" + word.trim() + ".png"));
                    }
                }
            } catch (HttpClientErrorException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 오류: API 키가 유효하지 않습니다.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 생성 오류: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(savedImages);
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/api/getStoredImages")
    public ResponseEntity<?> getStoredImages() {
        File directory = new File(imageStoragePath);
        File[] files = directory.listFiles((dir, name) -> name.toLowerCase().endsWith(".png"));
        
        if (files != null && files.length > 0) {
            List<Map<String, String>> imageList = new ArrayList<>();
            
            for (File file : files) {
                String fileName = file.getName();
                imageList.add(Map.of(
                    "prompt", fileName.replace(".png", ""),
                    "url", "/images/" + fileName
                ));
            }
            
            return ResponseEntity.ok(imageList);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("저장된 이미지가 없습니다.");
    }

    @PostMapping("/save-blank-question")
    public ResponseEntity<?> saveBlankQuestion(@RequestBody Map<String, Object> request) {
        try {
            QuestionList questionList = new QuestionList();
            questionList.setStageLevel((String) request.get("stageLevel"));
            questionList.setQuestion((String) request.get("sentence"));
            questionList.setResult((String) request.get("answer"));
            questionList.setType("blank");

            @SuppressWarnings("unchecked")
            List<String> wrongOptions = (List<String>) request.get("wrongOptions");
            String wrongData = String.join(",", wrongOptions);
            questionList.setWrongData(wrongData);
            
            QuestionList savedQuestion = questionListRepository.save(questionList);

            Map<String, Object> response = Map.of(
                "questionListId", savedQuestion.getQuestionListId(),
                "stageLevel", savedQuestion.getStageLevel(),
                "sentence", savedQuestion.getQuestion(),
                "answer", savedQuestion.getResult(),
                "wrongOptions", wrongOptions,
                "type", savedQuestion.getType()
            );

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문제 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/get-blank-question/{questionId}")
    public ResponseEntity<?> getBlankQuestion(@PathVariable Long questionId) {
        try {
            QuestionList question = questionListRepository.findById(questionId).orElse(null);
            
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("해당 ID의 문제를 찾을 수 없습니다: " + questionId);
            }
            
            List<String> wrongOptions = Arrays.asList(question.getWrongData().split(","));
            
            Map<String, Object> response = Map.of(
                "questionListId", question.getQuestionListId(),
                "stageLevel", question.getStageLevel(),
                "sentence", question.getQuestion(),
                "answer", question.getResult(),
                "wrongOptions", wrongOptions,
                "type", question.getType()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("문제 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}