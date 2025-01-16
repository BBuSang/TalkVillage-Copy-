//package Project.Backend.controller.app;
//
//import org.springframework.beans.factory.annotation.Value;
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
//@RestController
//@CrossOrigin(origins = "http://localhost:3000")
//public class FreepikController {
//
//    @Value("${freepik.api.key}") // application.properties 파일에 키 저장
//    private String apiKey;
//
//    private final String API_URL = "https://api.freepik.com/v1/resources";
//
//    @GetMapping("/api/freepik/resources")
//    public ResponseEntity<?> getResources(@RequestParam String query) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        // 요청 헤더 설정
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("x-freepik-api-key", apiKey);
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//        String url = API_URL + "?query=" + query;
//
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
//        return ResponseEntity.ok(response.getBody());
//    }
//}
