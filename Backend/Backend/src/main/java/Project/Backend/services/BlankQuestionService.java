// Project.Backend.services.BlankQuestionService.java
package Project.Backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@Service
public class BlankQuestionService {
    
    private final String DATAMUSE_API_URL = "https://api.datamuse.com/words";
    private final RestTemplate restTemplate;

    public BlankQuestionService() {
        this.restTemplate = new RestTemplate();
    }

    public List<String> generateWrongOptions(String answer) {
        List<String> wrongOptions = new ArrayList<>();
        
        // 1. 의미가 비슷한 단어 (Means Like)
        wrongOptions.addAll(getRelatedWords("ml=" + answer));
        
        // 2. 반의어 (Antonyms)
        wrongOptions.addAll(getRelatedWords("rel_ant=" + answer));
        
        // 3. 연관된 단어 (Triggers)
        wrongOptions.addAll(getRelatedWords("rel_trg=" + answer));

        // 중복 제거 및 필터링
        return wrongOptions.stream()
                .distinct()
                .filter(word -> !word.equalsIgnoreCase(answer))  // 정답 제외
                .filter(word -> word.matches("^[a-zA-Z]+$"))    // 영단어만 포함
                .filter(word -> word.length() >= 2)             // 2글자 이상
                .filter(word -> word.length() <= 12)            // 12글자 이하
                .limit(4)                                       // 4개만 선택
                .toList();
    }

    private List<String> getRelatedWords(String queryParam) {
        try {
            String url = DATAMUSE_API_URL + "?" + queryParam;
            ResponseEntity<DatamuseWord[]> response = restTemplate.getForEntity(url, DatamuseWord[].class);
            
            if (response.getBody() != null) {
                return Arrays.stream(response.getBody())
                        .map(DatamuseWord::getWord)
                        .toList();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    private static class DatamuseWord {
        private String word;
        private int score;
        
        public String getWord() {
            return word;
        }
        
        public void setWord(String word) {
            this.word = word;
        }
    }
}