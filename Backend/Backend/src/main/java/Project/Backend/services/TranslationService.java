package Project.Backend.services;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class TranslationService {
    private final CloseableHttpClient httpClient;
    private final String apiUrl = "https://api-free.deepl.com/v2/translate";
    private final String authKey = "52b69d00-5cc6-480e-b07e-1011a54b3ad1:fx";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TranslationService() {
        this.httpClient = HttpClients.createDefault();
    }

    public String translate(String text, String targetLang) throws IOException {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }

        try {
            // JSON 문자열인 경우 파싱하여 의미만 추출
            if (text.startsWith("{") && text.endsWith("}")) {
                JsonNode jsonNode = objectMapper.readTree(text);
                if (jsonNode.has("definitions")) {
                    JsonNode definitions = jsonNode.get("definitions");
                    if (definitions.isArray() && definitions.size() > 0) {
                        JsonNode firstDef = definitions.get(0);
                        if (firstDef.has("meaning")) {
                            text = firstDef.get("meaning").asText();
                        }
                    }
                }
            }

            String encodedText = URLEncoder.encode(text.trim(), StandardCharsets.UTF_8.toString());
            String url = String.format("%s?auth_key=%s&text=%s&target_lang=%s", 
                apiUrl, authKey, encodedText, targetLang);

            HttpGet request = new HttpGet(url);

            String responseBody = httpClient.execute(request, response -> 
                EntityUtils.toString(response.getEntity()));
            
            JsonNode responseNode = objectMapper.readTree(responseBody);
            if (responseNode.has("translations") && 
                responseNode.get("translations").isArray() && 
                responseNode.get("translations").size() > 0) {
                return responseNode.get("translations").get(0).get("text").asText();
            }
            return ""; 
            
        } catch (Exception e) {
            e.printStackTrace();
            return text;
        }
    }

    public String[] translateMultiple(String[] texts, String targetLang) throws IOException {
        if (texts == null || texts.length == 0) {
            return new String[0];
        }

        String[] translatedTexts = new String[texts.length];
        for (int i = 0; i < texts.length; i++) {
            if (texts[i] != null && !texts[i].trim().isEmpty()) {
                translatedTexts[i] = translate(texts[i], targetLang);
            } else {
                translatedTexts[i] = "";
            }
        }
        return translatedTexts;
    }

    public boolean isTranslatable(String text) {
        return text != null && !text.trim().isEmpty();
    }
}