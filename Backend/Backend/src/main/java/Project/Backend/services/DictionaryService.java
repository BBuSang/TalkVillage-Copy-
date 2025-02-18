package Project.Backend.services;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DictionaryService {
    private final CloseableHttpClient httpClient;
    private final String apiKey = "53a703ed-1509-46d0-8593-e0d83ae50297";
    private final Gson gson = new GsonBuilder()
            .setLenient()
            .create();

    public DictionaryService() {
        this.httpClient = HttpClients.createDefault();
    }

    public Map<String, Object> getWordDefinitionAndExamples(String word) throws IOException {
        String url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" 
                    + word + "?key=" + apiKey;

        HttpGet request = new HttpGet(url);
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> meanings = new ArrayList<>();
        List<Map<String, Object>> examples = new ArrayList<>();
        List<Map<String, Object>> synonyms = new ArrayList<>();
        List<Map<String, Object>> idioms = new ArrayList<>();
        result.put("word", word);

        try {
            String responseBody = httpClient.execute(request, response -> 
                EntityUtils.toString(response.getEntity()));
            
            JsonArray jsonArray = JsonParser.parseString(responseBody).getAsJsonArray();
            
            for (JsonElement entry : jsonArray) {
                if (!entry.isJsonObject()) continue;
                
                JsonObject entryObj = entry.getAsJsonObject();
                String partOfSpeech = entryObj.has("fl") ? entryObj.get("fl").getAsString() : "";
                
                // 의미 추출
                if (entryObj.has("shortdef")) {
                    JsonArray shortDefs = entryObj.getAsJsonArray("shortdef");
                    for (int i = 0; i < shortDefs.size(); i++) {
                        final int order = i + 1;
                        String definition = shortDefs.get(i).getAsString();
                        
                        if (definition != null && !definition.trim().isEmpty()) {
                            Map<String, Object> meaningMap = new HashMap<>();
                            List<Map<String, Object>> definitionsList = new ArrayList<>();
                            
                            Map<String, Object> definitionMap = new HashMap<>();
                            definitionMap.put("order", order);
                            definitionMap.put("meaning", definition);
                            definitionMap.put("type", "basic meaning");
                            
                            definitionsList.add(definitionMap);
                            
                            meaningMap.put("partOfSpeech", partOfSpeech);
                            meaningMap.put("definitions", definitionsList);
                            meanings.add(meaningMap);
                        }
                    }
                }

                // 예문, 동의어, 관용구 추출
                if (entryObj.has("def")) {
                    JsonArray defs = entryObj.getAsJsonArray("def");
                    extractExamples(defs, examples);
                    extractSynonyms(entryObj, synonyms);
                    extractIdioms(defs, idioms);
                }
            }

            // 결과 로깅
            for (Map<String, Object> meaning : meanings) {
                System.out.println(gson.toJson(meaning));
            }

            result.put("meanings", meanings);
            result.put("examples", examples);
            result.put("synonyms", synonyms);
            result.put("idioms", idioms);

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Dictionary API request failed", e);
        }
    }

    private void extractExamples(JsonArray defs, List<Map<String, Object>> examples) {
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
                                    if (dtElement.isJsonArray() && 
                                        dtElement.getAsJsonArray().get(0).getAsString().equals("vis")) {
                                        JsonArray visArray = dtElement.getAsJsonArray().get(1).getAsJsonArray();
                                        for (JsonElement vis : visArray) {
                                            if (vis.getAsJsonObject().has("t")) {
                                                String example = vis.getAsJsonObject().get("t").getAsString()
                                                    .replaceAll("\\{[^}]*\\}", "")
                                                    .trim();
                                                
                                                if (!example.isEmpty()) {
                                                    Map<String, Object> exampleMap = new HashMap<>();
                                                    exampleMap.put("text", example);
                                                    examples.add(exampleMap);
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

    private void extractSynonyms(JsonObject entryObj, List<Map<String, Object>> synonyms) {
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
                                                Map<String, Object> synonymMap = new HashMap<>();
                                                synonymMap.put("word", synonym);
                                                synonyms.add(synonymMap);
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

    private void extractIdioms(JsonArray defs, List<Map<String, Object>> idioms) {
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
                                        if (firstElement.isJsonPrimitive() && 
                                            firstElement.getAsString().equals("text")) {
                                            String text = dtElement.getAsJsonArray().get(1).getAsString()
                                                .replaceAll("\\{sx\\|.*?\\|\\|\\}", "")
                                                .replaceAll("\\{[^}]*\\}", "")
                                                .replaceAll("\\s*,\\s*$", "")
                                                .trim();
                                                
                                            if (!text.isEmpty() && !text.equals(",")) {
                                                Map<String, Object> idiomMap = new HashMap<>();
                                                idiomMap.put("type", "idiom");
                                                idiomMap.put("phrase", text);
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