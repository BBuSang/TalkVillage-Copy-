package Project.Backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

// deepl 기본 사용
//@Service
//public class TranslationService {
//
//    private final String DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
//    private final String DEEPL_API_KEY = "52b69d00-5cc6-480e-b07e-1011a54b3ad1:fx"; // DeepL API 키
//
//    // 단일 텍스트 번역
//    public String translateText(String text, String targetLang) {
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        headers.set("Authorization", "DeepL-Auth-Key " + DEEPL_API_KEY);
//
//        // DeepL API 요청
//        String requestBody = "text=" + text + "&target_lang=" + targetLang;
//        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
//
//        // API 호출
//        ResponseEntity<String> response = restTemplate.exchange(DEEPL_API_URL, HttpMethod.POST, request, String.class);
//        JSONObject jsonResponse = new JSONObject(response.getBody());
//        return jsonResponse.getJSONArray("translations").getJSONObject(0).getString("text");
//    }
//
//    // 여러 문장을 번역
//    public List<String> translateTexts(List<String> texts, String targetLang) {
//        List<String> translatedTexts = new ArrayList<>();
//        for (String text : texts) {
//            translatedTexts.add(translateText(text, targetLang)); // 각각의 문장을 번역
//        }
//        return translatedTexts;
//    }
//}

// merriam + deepl test
// @Service
// public class TranslationService {

//     private final OkHttpClient client = new OkHttpClient();
//     private final String apiKey = "52b69d00-5cc6-480e-b07e-1011a54b3ad1:fx";  // 여기에 번역 API 키를 넣으세요.

//     public String translateText(String text, String targetLang) throws IOException {
//         String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
//         String url = "https://api-free.deepl.com/v2/translate?auth_key=" + apiKey + "&text=" + encodedText + "&target_lang=" + targetLang;

//         Request request = new Request.Builder()
//                 .url(url)
//                 .build();

//         try (Response response = client.newCall(request).execute()) {
//             if (!response.isSuccessful()) {
//                 throw new IOException("Unexpected code " + response);
//             }

//             // 번역된 텍스트를 추출 (DeepL API 사용)
//             return response.body().string(); // 실제 응답 JSON 파싱 추가 필요
//         }
//     }
// }

@Service
public class TranslationService {

    private final String apiKey = "52b69d00-5cc6-480e-b07e-1011a54b3ad1:fx";  // DeepL API 키
    private final String deeplApiUrl = "https://api-free.deepl.com/v2/translate";  // DeepL API URL

    public String translate(String text, String targetLang) {
        RestTemplate restTemplate = new RestTemplate();

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "DeepL-Auth-Key " + apiKey);

        // 요청 바디 설정
        String body = "text=" + URLEncoder.encode(text, StandardCharsets.UTF_8) +
                      "&target_lang=" + URLEncoder.encode(targetLang, StandardCharsets.UTF_8);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            // DeepL API에 POST 요청
            ResponseEntity<Map> response = restTemplate.exchange(
                    deeplApiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // 번역 결과 추출
            Map<String, Object> result = response.getBody();
            if (result != null && result.containsKey("translations")) {
                Map<String, String> translation = ((List<Map<String, String>>) result.get("translations")).get(0);
                return translation.get("text");
            }

            return "번역 결과를 찾을 수 없습니다.";
        } catch (Exception e) {
            return "번역 중 오류가 발생했습니다: " + e.getMessage();
        }
    }
}
