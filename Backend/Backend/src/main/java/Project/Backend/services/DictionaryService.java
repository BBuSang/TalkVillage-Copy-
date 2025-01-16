package Project.Backend.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
//
//// merriam test
//@Service
//public class DictionaryService {
//
//    private final OkHttpClient client = new OkHttpClient();
//    private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";  // 여기에 발급받은 API 키를 넣으세요.
//
//    public String getWordDefinition(String word) throws IOException {
//        String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;
//
//        Request request = new Request.Builder()
//                .url(url)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new IOException("Unexpected code " + response);
//            }
//
//            String jsonData = response.body().string();
//            JsonElement jsonElement = JsonParser.parseString(jsonData);
//
//            if (jsonElement.isJsonArray()) {
//                JsonArray jsonArray = jsonElement.getAsJsonArray();
//                if (jsonArray.size() > 0 && jsonArray.get(0).getAsJsonObject().has("shortdef")) {
//                    JsonArray definitions = jsonArray.get(0).getAsJsonObject().get("shortdef").getAsJsonArray();
//                    StringBuilder result = new StringBuilder("Definitions:\n");
//                    for (JsonElement definition : definitions) {
//                        result.append("- ").append(definition.getAsString()).append("\n");
//                    }
//                    return result.toString();
//                }
//            }
//            return "No definition found for the word: " + word;
//        }
//    }
//}



// deepl + merriam 결합
// http://localhost:9999/define?word=apple&targetLang=KO
//@Service
//public class DictionaryService {
//
//    private final OkHttpClient client = new OkHttpClient();
//    private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";  // 여기에 사전 API 키를 넣으세요.
//
//    @Autowired
//    private TranslationService translationService;
//
//    public String getWordDefinitionWithTranslation(String word, String targetLang) throws IOException {
//        String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;
//
//        Request request = new Request.Builder()
//                .url(url)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new IOException("Unexpected code " + response);
//            }
//
//            String jsonData = response.body().string();
//
//            // JsonReader를 사용하여 lenient 모드 설정
//            JsonReader reader = new JsonReader(new StringReader(jsonData));
//            reader.setLenient(true);  // lenient 모드 활성화
//
//            // lenient 모드로 JsonElement 파싱
//            JsonElement jsonElement = JsonParser.parseReader(reader);
//
//            if (jsonElement.isJsonArray()) {
//                JsonArray jsonArray = jsonElement.getAsJsonArray();
//                if (jsonArray.size() > 0 && jsonArray.get(0).getAsJsonObject().has("shortdef")) {
//                    JsonArray definitions = jsonArray.get(0).getAsJsonObject().get("shortdef").getAsJsonArray();
//                    StringBuilder originalDefinitions = new StringBuilder("Original Definitions:\n");
//                    StringBuilder translatedDefinitions = new StringBuilder("Translated Definitions:\n");
//
//                    for (JsonElement definition : definitions) {
//                        String def = definition.getAsString();
//                        originalDefinitions.append("- ").append(def).append("\n");
//                    }
//
//                    // 번역된 정의 추가 (줄바꿈 포함)
//                    String translatedText = translationService.translateText(originalDefinitions.toString(), targetLang);
//                    translatedText = translatedText.replace("\\n", "\n");  // 줄바꿈 처리
//
//                    translatedDefinitions.append(translatedText);
//
//                    // 최종 결과 반환
//                    return originalDefinitions.toString() + "\n" + translatedDefinitions.toString();
//                }
//            }
//            return "No definition found for the word: " + word;
//        }
//    }
//}

// 예문 테스트
// http://localhost:9999/define?word=apple
// @Service
// public class DictionaryService {

//     private final OkHttpClient client = new OkHttpClient();
//     private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";  // 여기에 발급받은 API 키를 넣으세요.

//     public String getWordDefinitionAndExamples(String word) throws IOException {
//         String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;

//         Request request = new Request.Builder()
//                 .url(url)
//                 .build();

//         try (Response response = client.newCall(request).execute()) {
//             if (!response.isSuccessful()) {
//                 throw new IOException("Unexpected code " + response);
//             }

//             String jsonData = response.body().string();
//             JsonElement jsonElement = JsonParser.parseString(jsonData);

//             if (jsonElement.isJsonArray()) {
//                 JsonArray jsonArray = jsonElement.getAsJsonArray();
//                 if (jsonArray.size() > 0) {
//                     StringBuilder result = new StringBuilder("<h2>Definitions and Examples:</h2>\n");
//                     JsonElement entry = jsonArray.get(0);

//                     // 정의 추출
//                     if (entry.getAsJsonObject().has("shortdef")) {
//                         JsonArray definitions = entry.getAsJsonObject().get("shortdef").getAsJsonArray();
//                         result.append("<h3>Definitions:</h3>\n<ul>");
//                         for (JsonElement definition : definitions) {
//                             result.append("<li>").append(definition.getAsString()).append("</li>\n");
//                         }
//                         result.append("</ul>");
//                     }

//                  // 예문 추출 부분에서 최대 3개의 예문을 가져오는 방법
//                     if (entry.getAsJsonObject().has("dros")) {
//                         result.append("<h3>Examples:</h3>\n<ul>");
//                         JsonArray dros = entry.getAsJsonObject().get("dros").getAsJsonArray();
//                         int exampleCount = 0;  // 예문 카운트를 위한 변수
//                         for (JsonElement dro : dros) {
//                             if (dro.getAsJsonObject().has("def")) {
//                                 JsonArray defArray = dro.getAsJsonObject().get("def").getAsJsonArray();
//                                 for (JsonElement def : defArray) {
//                                     if (def.getAsJsonObject().has("sseq")) {
//                                         JsonArray sseqArray = def.getAsJsonObject().get("sseq").getAsJsonArray();
//                                         for (JsonElement sseq : sseqArray) {
//                                             if (sseq.getAsJsonArray().size() > 0) {
//                                                 JsonArray senseArray = sseq.getAsJsonArray().get(0).getAsJsonArray();
//                                                 if (senseArray.get(1).getAsJsonObject().has("dt")) {
//                                                     JsonArray dtArray = senseArray.get(1).getAsJsonObject().get("dt").getAsJsonArray();
//                                                     for (JsonElement dt : dtArray) {
//                                                         if (dt.isJsonArray() && dt.getAsJsonArray().get(0).getAsString().equals("vis")) {
//                                                             JsonArray visArray = dt.getAsJsonArray().get(1).getAsJsonArray();
//                                                             for (JsonElement vis : visArray) {
//                                                                 if (vis.getAsJsonObject().has("t")) {
//                                                                     // {it} 태그를 <i> 태그로 변환하여 추가
//                                                                     result.append("<li>").append(formatItalic(vis.getAsJsonObject().get("t").getAsString())).append("</li>\n");
//                                                                     exampleCount++;  // 예문 카운트 증가
//                                                                     if (exampleCount >= 3) {  // 최대 3개까지 가져옴
//                                                                         break;
//                                                                     }
//                                                                 }
//                                                             }
//                                                         }
//                                                     }
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                         result.append("</ul>");
//                     }


//                     return result.toString();
//                 }
//             }
//             return "<h2>No information found for the word: " + word + "</h2>";
//         }
//     }

//     // 이탈릭 처리 함수 추가
//     private String formatItalic(String input) {
//         return input.replace("{it}", "<i>").replace("{/it}", "</i>");
//     }
// }

//@Service
//public class DictionaryService {
//
//    private final OkHttpClient client = new OkHttpClient();
//    private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";  // 발급받은 API 키를 사용
//
//    public Map<String, Object> getWordDefinitionAndExamples(String word) throws IOException {
//        String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;
//
//        Request request = new Request.Builder().url(url).build();
//        Map<String, Object> result = new HashMap<>();  // 결과를 담을 Map 생성
//        result.put("word", word);  // 단어를 먼저 추가
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new IOException("Unexpected code " + response);
//            }
//
//            String jsonData = response.body().string();
//            JsonElement jsonElement = JsonParser.parseString(jsonData);
//
//            if (jsonElement.isJsonArray()) {
//                JsonArray jsonArray = jsonElement.getAsJsonArray();
//                if (jsonArray.size() > 0) {
//                    JsonElement entry = jsonArray.get(0);
//
//                    // 정의 추출
//                    if (entry.getAsJsonObject().has("shortdef")) {
//                        JsonArray definitions = entry.getAsJsonObject().get("shortdef").getAsJsonArray();
//                        List<String> definitionList = new ArrayList<>();
//                        for (JsonElement definition : definitions) {
//                            definitionList.add(definition.getAsString());
//                        }
//                        result.put("definitions", definitionList);  // 정의 추가
//                    } else {
//                        result.put("definitions", new ArrayList<>());  // 정의가 없을 경우 빈 리스트 추가
//                    }
//
//                    // 예문 추출
//                    if (entry.getAsJsonObject().has("dros")) {
//                        JsonArray dros = entry.getAsJsonObject().get("dros").getAsJsonArray();
//                        List<String> examplesList = new ArrayList<>();
//                        for (JsonElement dro : dros) {
//                            if (dro.getAsJsonObject().has("def")) {
//                                JsonArray defArray = dro.getAsJsonObject().get("def").getAsJsonArray();
//                                for (JsonElement def : defArray) {
//                                    if (def.getAsJsonObject().has("sseq")) {
//                                        JsonArray sseqArray = def.getAsJsonObject().get("sseq").getAsJsonArray();
//                                        for (JsonElement sseq : sseqArray) {
//                                            if (sseq.getAsJsonArray().size() > 0) {
//                                                JsonArray senseArray = sseq.getAsJsonArray().get(0).getAsJsonArray();
//                                                if (senseArray.get(1).getAsJsonObject().has("dt")) {
//                                                    JsonArray dtArray = senseArray.get(1).getAsJsonObject().get("dt").getAsJsonArray();
//                                                    for (JsonElement dt : dtArray) {
//                                                        if (dt.isJsonArray() && dt.getAsJsonArray().get(0).getAsString().equals("vis")) {
//                                                            JsonArray visArray = dt.getAsJsonArray().get(1).getAsJsonArray();
//                                                            for (JsonElement vis : visArray) {
//                                                                if (vis.getAsJsonObject().has("t")) {
//                                                                    examplesList.add(vis.getAsJsonObject().get("t").getAsString());
//                                                                }
//                                                            }
//                                                        }
//                                                    }
//                                                }
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                        result.put("examples", examplesList);  // 예문 추가
//                    } else {
//                        result.put("examples", new ArrayList<>());  // 예문이 없을 경우 빈 리스트 추가
//                    }
//                }
//            }
//        }
//
//        return result;  // Map<String, Object> 형식으로 정의 및 예문 데이터를 반환
//    }
//}
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DictionaryService {
    private final OkHttpClient client = new OkHttpClient();
    private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";
    private final Gson gson = new GsonBuilder()
            .setLenient()
            .create();

    public Map<String, Object> getWordDefinitionAndExamples(String word) throws IOException {
        String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" 
                    + word + "?key=" + apiKey;

        Request request = new Request.Builder().url(url).build();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> meanings = new ArrayList<>();
        List<String> examples = new ArrayList<>();
        List<String> synonyms = new ArrayList<>();
        List<Map<String, Object>> idioms = new ArrayList<>();
        result.put("word", word);

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("API 요청 실패: " + response);
            }

            String responseBody = response.body().string();
            JsonArray jsonArray = JsonParser.parseString(responseBody).getAsJsonArray();
            
            for (JsonElement entry : jsonArray) {
                if (!entry.isJsonObject()) continue;
                
                JsonObject entryObj = entry.getAsJsonObject();
                String partOfSpeech = entryObj.has("fl") ? entryObj.get("fl").getAsString() : "";
                
                // 의미 추출
                if (entryObj.has("shortdef")) {
                    JsonArray shortDefs = entryObj.getAsJsonArray("shortdef");
                    for (JsonElement def : shortDefs) {
                        Map<String, Object> meaningMap = new HashMap<>();
                        meaningMap.put("meaning", def.getAsString());
                        meaningMap.put("partOfSpeech", partOfSpeech);
                        meaningMap.put("order", meanings.size() + 1);
                        meaningMap.put("type", "기본의미");
                        meanings.add(meaningMap);
                    }
                }

                // 예문과 유의어, 관용구 추출
                if (entryObj.has("def")) {
                    JsonArray defs = entryObj.getAsJsonArray("def");
                    extractExamples(defs, examples);
                    extractSynonyms(entryObj, synonyms);
                    
                    // 관용구 추출
                    for (JsonElement def : defs) {
                        if (!def.isJsonObject()) continue;
                        
                        JsonObject defObj = def.getAsJsonObject();
                        if (defObj.has("sseq")) {
                            JsonArray sseq = defObj.getAsJsonArray("sseq");
                            for (JsonElement sseqElement : sseq) {
                                if (!sseqElement.isJsonArray()) continue;
                                
                                for (JsonElement senseGroup : sseqElement.getAsJsonArray()) {
                                    if (!senseGroup.isJsonArray()) continue;
                                    
                                    for (JsonElement sense : senseGroup.getAsJsonArray()) {
                                        if (!sense.isJsonObject()) continue;
                                        
                                        JsonObject senseObj = sense.getAsJsonObject();
                                        if (senseObj.has("dt")) {
                                            JsonArray dt = senseObj.getAsJsonArray("dt");
                                            for (JsonElement dtElement : dt) {
                                                if (dtElement.isJsonArray() && dtElement.getAsJsonArray().size() > 0) {
                                                    JsonElement firstElement = dtElement.getAsJsonArray().get(0);
                                                    if (firstElement.isJsonPrimitive() && firstElement.getAsString().equals("text")) {
                                                        String text = dtElement.getAsJsonArray().get(1).getAsString()
                                                            .replaceAll("\\{sx\\|.*?\\|\\|\\}", "") // 유의어 태그 제거
                                                            .replaceAll("\\{[^}]*\\}", "") // 다른 태그들 제거
                                                            .replaceAll("\\s*,\\s*$", "") // 끝에 있는 콤마와 공백 제거
                                                            .trim();
                                                            
                                                        if (!text.isEmpty() && !text.equals(",")) { // 콤마만 있는 경우 제외
                                                            Map<String, Object> idiomMap = new HashMap<>();
                                                            idiomMap.put("meaning", text);
                                                            idiomMap.put("type", "관용구");
                                                            idiomMap.put("order", idioms.size() + 1);
                                                            idioms.add(idiomMap);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        System.out.println("Extracted meanings: " + meanings.size());
        System.out.println("Extracted examples: " + examples.size());
        System.out.println("Extracted synonyms: " + synonyms.size());
        System.out.println("Extracted idioms: " + idioms.size());

        result.put("meanings", meanings);
        result.put("examples", examples);
        result.put("synonyms", synonyms);
        result.put("idioms", idioms);

        return result;
    }

    private void extractExamples(JsonArray defs, List<String> examples) {
        for (JsonElement def : defs) {
            if (!def.isJsonObject()) continue;
            JsonObject defObj = def.getAsJsonObject();
            
            if (defObj.has("sseq")) {
                JsonArray sseq = defObj.getAsJsonArray("sseq");
                for (JsonElement sseqElement : sseq) {
                    if (!sseqElement.isJsonArray()) continue;
                    
                    for (JsonElement senseGroup : sseqElement.getAsJsonArray()) {
                        if (!senseGroup.isJsonArray()) continue;
                        
                        for (JsonElement sense : senseGroup.getAsJsonArray()) {
                            if (!sense.isJsonObject()) continue;
                            
                            JsonObject senseObj = sense.getAsJsonObject();
                            // sense 객체 내부의 dt 필드 확인
                            if (senseObj.has("sense")) {
                                JsonObject innerSense = senseObj.getAsJsonObject("sense");
                                if (innerSense.has("dt")) {
                                    JsonArray dt = innerSense.getAsJsonArray("dt");
                                    for (JsonElement dtElement : dt) {
                                        if (dtElement.isJsonArray()) {
                                            for (JsonElement dtItem : dtElement.getAsJsonArray()) {
                                                if (dtItem.isJsonObject() && dtItem.getAsJsonObject().has("vis")) {
                                                    JsonArray vis = dtItem.getAsJsonObject().getAsJsonArray("vis");
                                                    for (JsonElement visElement : vis) {
                                                        if (visElement.isJsonObject() && visElement.getAsJsonObject().has("t")) {
                                                            String example = visElement.getAsJsonObject().get("t").getAsString()
                                                                .replaceAll("\\{wi\\}", "")
                                                                .replaceAll("\\{\\/wi\\}", "")
                                                                .replaceAll("\\{[^}]*\\}", "")
                                                                .trim();
                                                            
                                                            if (!example.isEmpty() && !examples.contains(example)) {
                                                                examples.add(example);
                                                                System.out.println("Added example: " + example);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            
                            // dt 필드 직접 확인
                            if (senseObj.has("dt")) {
                                JsonArray dt = senseObj.getAsJsonArray("dt");
                                for (JsonElement dtElement : dt) {
                                    if (dtElement.isJsonArray()) {
                                        for (JsonElement item : dtElement.getAsJsonArray()) {
                                            if (item.isJsonArray() && item.getAsJsonArray().size() > 0) {
                                                JsonElement firstElement = item.getAsJsonArray().get(0);
                                                if (firstElement.isJsonObject() && firstElement.getAsJsonObject().has("t")) {
                                                    String example = firstElement.getAsJsonObject().get("t").getAsString()
                                                        .replaceAll("\\{wi\\}", "")
                                                        .replaceAll("\\{\\/wi\\}", "")
                                                        .replaceAll("\\{[^}]*\\}", "")
                                                        .trim();
                                                    
                                                    if (!example.isEmpty() && !examples.contains(example)) {
                                                        examples.add(example);
                                                        System.out.println("Added example: " + example);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        System.out.println("Total examples found: " + examples.size());
    }

    private void extractSynonyms(JsonObject entryObj, List<String> synonyms) {
        if (entryObj.has("def")) {
            JsonArray defs = entryObj.getAsJsonArray("def");
            for (JsonElement def : defs) {
                if (!def.isJsonObject()) continue;
                JsonObject defObj = def.getAsJsonObject();
                
                if (defObj.has("sseq")) {
                    JsonArray sseq = defObj.getAsJsonArray("sseq");
                    for (JsonElement sseqElement : sseq) {
                        if (!sseqElement.isJsonArray()) continue;
                        
                        for (JsonElement senseGroup : sseqElement.getAsJsonArray()) {
                            if (!senseGroup.isJsonArray()) continue;
                            
                            for (JsonElement sense : senseGroup.getAsJsonArray()) {
                                if (!sense.isJsonObject()) continue;
                                
                                JsonObject senseObj = sense.getAsJsonObject();
                                if (senseObj.has("dt")) {
                                    JsonArray dt = senseObj.getAsJsonArray("dt");
                                    for (JsonElement dtElement : dt) {
                                        if (!dtElement.isJsonArray()) continue;
                                        
                                        String dtText = dtElement.toString();
                                        if (dtText.contains("{sx|")) {
                                            Pattern pattern = Pattern.compile("\\{sx\\|(.*?)\\|\\|\\}");
                                            Matcher matcher = pattern.matcher(dtText);
                                            while (matcher.find()) {
                                                String synonym = matcher.group(1);
                                                if (!synonyms.contains(synonym)) {
                                                    synonyms.add(synonym);
                                                    System.out.println("Found synonym: " + synonym);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        System.out.println("Total synonyms found: " + synonyms.size());
    }
}