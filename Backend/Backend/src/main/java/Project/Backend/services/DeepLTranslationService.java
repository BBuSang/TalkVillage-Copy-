package Project.Backend.services;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DeepLTranslationService {

    private final String DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
    private final String API_KEY = "52b69d00-5cc6-480e-b07e-1011a54b3ad1:fx"; // 자신의 API 키를 여기에 입력하세요

    public String translateText(String text, String targetLang) {
        RestTemplate restTemplate = new RestTemplate();

        // POST 요청 준비
        JSONObject requestBody = new JSONObject();
        JSONArray textsArray = new JSONArray();
        textsArray.put(text); // 텍스트를 배열에 추가
        requestBody.put("text", textsArray);
        requestBody.put("target_lang", targetLang);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "DeepL-Auth-Key " + API_KEY);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        // POST 요청 보내기
        ResponseEntity<String> response = restTemplate.exchange(DEEPL_API_URL, HttpMethod.POST, entity, String.class);

        // JSON 응답 파싱
        JSONObject jsonResponse = new JSONObject(response.getBody());
        String translatedText = jsonResponse.getJSONArray("translations")
                                            .getJSONObject(0)
                                            .getString("text");

        return translatedText; // 번역된 텍스트 반환
    }
}
