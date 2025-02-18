package Project.Backend.controller.app;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

////
////import org.springframework.http.HttpEntity;
////import org.springframework.http.HttpHeaders;
////import org.springframework.http.HttpMethod;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.CrossOrigin;
////import org.springframework.web.bind.annotation.GetMapping;
////import org.springframework.web.bind.annotation.RequestParam;
////import org.springframework.web.bind.annotation.RestController;
////import org.springframework.web.client.RestTemplate;
////
////import java.util.List;
////import java.util.Map;
////
////@RestController
////@CrossOrigin(origins = "http://localhost:3000")
////public class FlaticonController {
////
////   private final String API_KEY = "FPSX3ad727cbbbcc4a7faa0cfb43cb1bd314"; // 실제 API 키로 교체하세요
////   private final String ICON_SEARCH_URL = "https://api.freepik.com/v1/icons"; // 실제 아이콘 검색 URL
////
////   @GetMapping("/searchIcon")
////   public ResponseEntity<?> searchIcon(@RequestParam String term) {
////       HttpHeaders headers = new HttpHeaders();
////       headers.add("x-freepik-api-key", API_KEY);
////       headers.add("Content-Type", "application/json");
////
////       String url = ICON_SEARCH_URL + "?term=" + term;
////
////       HttpEntity<String> entity = new HttpEntity<>(headers);
////       RestTemplate restTemplate = new RestTemplate();
////       try {
////           ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
////           Map<String, Object> responseBody = response.getBody();
////
////           if (responseBody != null && responseBody.containsKey("data")) {
////               List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
////
////               // 첫 번째 아이콘 데이터 로그 출력
////               if (!dataList.isEmpty()) {
////                   System.out.println("첫 번째 아이콘 데이터: " + dataList.get(0));
////                   Map<String, Object> firstIcon = dataList.get(0);
////
////                   // thumbnails 배열에서 첫 번째 URL 추출
////                   List<Map<String, Object>> thumbnails = (List<Map<String, Object>>) firstIcon.get("thumbnails");
////                   if (thumbnails != null && !thumbnails.isEmpty()) {
////                       String thumbnailUrl = (String) thumbnails.get(0).get("url");
////                       String title = (String) firstIcon.getOrDefault("name", "아이콘");
////                       return ResponseEntity.ok(Map.of("thumbnail_url", thumbnailUrl, "title", title));
////                   }
////               }
////           }
////           return ResponseEntity.status(404).body("아이콘을 찾을 수 없습니다.");
////       } catch (Exception e) {
////           e.printStackTrace();
////           return ResponseEntity.status(500).body("아이콘 검색 오류: " + e.getMessage());
////       }
////   }
////}
//
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.client.RestTemplate;
//
////import org.springframework.http.HttpEntity;
////import org.springframework.http.HttpHeaders;
////import org.springframework.http.HttpMethod;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.CrossOrigin;
////import org.springframework.web.bind.annotation.GetMapping;
////import org.springframework.web.bind.annotation.RequestParam;
////import org.springframework.web.bind.annotation.RestController;
////import org.springframework.web.client.RestTemplate;
////
////import java.util.List;
////import java.util.Map;
////
////@RestController
////@CrossOrigin(origins = "http://localhost:3000")
////public class FlaticonController {
////
////    private final String API_KEY = "FPSX3ad727cbbbcc4a7faa0cfb43cb1bd314";  // 실제 API 키를 입력하세요
////    private final String TEXT_TO_IMAGE_URL = "https://api.freepik.com/v1/ai/text-to-image";
////
////    @GetMapping("/generateImage")
////    public ResponseEntity<?> generateImage(@RequestParam String prompt) {
////        HttpHeaders headers = new HttpHeaders();
////        headers.add("x-freepik-api-key", API_KEY);
////        headers.add("Content-Type", "application/json");
////
////        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"image\": { \"size\": \"medium\" }, \"num_images\": 1 }";
////        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
////
////        RestTemplate restTemplate = new RestTemplate();
////        try {
////            ResponseEntity<Map> response = restTemplate.exchange(TEXT_TO_IMAGE_URL, HttpMethod.POST, entity, Map.class);
////            Map<String, Object> responseBody = response.getBody();
////
////            if (responseBody != null && responseBody.containsKey("data")) {
////                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
////                if (!dataList.isEmpty()) {
////                    // 첫 번째 항목의 base64 데이터를 가져와서 프론트엔드에 전달
////                    String base64Image = (String) dataList.get(0).get("base64");
////                    return ResponseEntity.ok(Map.of("base64Image", base64Image));
////                }
////            }
////            return ResponseEntity.status(404).body("이미지 데이터를 찾을 수 없습니다.");
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(500).body("이미지 생성 오류: " + e.getMessage());
////        }
////    }
////}
////import Project.Backend.entity.QuestionList;
////import Project.Backend.repository.QuestionListRepository;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.http.HttpEntity;
////import org.springframework.http.HttpHeaders;
////import org.springframework.http.HttpMethod;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.CrossOrigin;
////import org.springframework.web.bind.annotation.GetMapping;
////import org.springframework.web.bind.annotation.RestController;
////import org.springframework.web.client.RestTemplate;
////
////import java.util.ArrayList;
////import java.util.List;
////import java.util.Map;
////
////@RestController
////@CrossOrigin(origins = "http://localhost:3000")
////public class FlaticonController {
////
////    @Autowired
////    private QuestionListRepository questionListRepository;
////    // FPSXbe549cff4adf4ee794603a4abc858373
////    private final String API_KEY = "FPSX3ad727cbbbcc4a7faa0cfb43cb1bd314";
////    private final String TEXT_TO_IMAGE_URL = "https://api.freepik.com/v1/ai/text-to-image";
////
////    @GetMapping("/api/generateImage")
////    public ResponseEntity<?> generateImages() {
////        // "type"이 "word"인 첫 번째 QuestionList 가져오기
////        List<QuestionList> questionLists = questionListRepository.findTop1ByTypeOrderByQuestionListIdAsc("word");
////
////        if (questionLists.isEmpty()) {
////            return ResponseEntity.status(404).body("조건에 맞는 질문 목록을 찾을 수 없습니다.");
////        }
////
////        QuestionList questionList = questionLists.get(0);
////        String[] words = questionList.getQuestion().split(",\\s*"); // 쉼표로 단어 분리
////        String result = questionList.getResult(); // 해당 question의 result 값
////        List<Map<String, String>> images = new ArrayList<>();
////
////        RestTemplate restTemplate = new RestTemplate();
////        HttpHeaders headers = new HttpHeaders();
////        headers.add("x-freepik-api-key", API_KEY);
////        headers.add("Content-Type", "application/json");
////
////        String templatePrefix = "A simple, cartoon-style painting of one type of an ";
////
////        try {
////            // 각 단어에 대해 이미지 요청
////            for (String word : words) {
////                String prompt = templatePrefix + word;
////                String requestBody = "{ \"prompt\": \"" + prompt + "\", \"image\": { \"size\": \"medium\" }, \"num_images\": 1 }";
////                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
////
////                ResponseEntity<Map> response = restTemplate.exchange(TEXT_TO_IMAGE_URL, HttpMethod.POST, entity, Map.class);
////                Map<String, Object> responseBody = response.getBody();
////
////                if (responseBody != null && responseBody.containsKey("data")) {
////                    List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
////                    if (!dataList.isEmpty() && dataList.get(0).containsKey("base64")) {
////                        String base64Image = (String) dataList.get(0).get("base64");
////                        images.add(Map.of(
////                            "prompt", prompt,
////                            "base64Image", base64Image,
////                            "word", word,
////                            "result", result // 각 단어와 같은 result 값 포함
////                        ));
////                    } else {
////                        System.out.println("Failed to retrieve base64 image for prompt: " + prompt);
////                    }
////                } else {
////                    System.out.println("Response body does not contain expected data for prompt: " + prompt);
////                }
////            }
////            return ResponseEntity.ok(images);
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(500).body("이미지 생성 오류: " + e.getMessage());
////        }
////    }
////}
//
//
//
import Project.Backend.entity.QuestionList;
import Project.Backend.repository.QuestionListRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FlaticonController {

    @Autowired
    private QuestionListRepository questionListRepository;

     private final String API_KEY = "FPSX3ad727cbbbcc4a7faa0cfb43cb1bd314";
//     private final String API_KEY = "FPSX8cee6649715f4308bfc8493d9ced1e77";
//    private final String API_KEY = "FPSXbe549cff4adf4ee794603a4abc858373";
    private final String TEXT_TO_IMAGE_URL = "https://api.freepik.com/v1/ai/text-to-image";

    @PostMapping("/api/questionsByTheme")
    public ResponseEntity<?> getQuestionsByTheme(@RequestParam("themeId") String themeId) {
        List<QuestionList> questions = questionListRepository
            .findByStageLevelStartingWith(themeId);

        if (questions.isEmpty()) {
            return ResponseEntity.status(404).body("해당 테마의 질문을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(questions);
    }
}
