package Project.Backend.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import Project.Backend.classes.DictionaryData;

@Service
public class DictionaryCacheService {
    private static final String DICTIONARY_FILE_PATH = "src/main/resources/dictionary-cache.json";
    private static final String DICTIONARY_DATA_PATH = "src/main/resources/dictionary.json";
    private static final int MAX_ENTRIES = 10000;
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private static final Object fileLock = new Object();
    private final ObjectMapper objectMapper;
    private Map<String, DictionaryData> dictionaryData;

    public DictionaryCacheService() {
        this.objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .enable(SerializationFeature.INDENT_OUTPUT);
        
        loadDictionaryData();
    }

    private void loadDictionaryData() {
        try {
            File file = new File(DICTIONARY_DATA_PATH);
            if (!file.exists()) {
                // dictionary.json 파일이 없으면 생성
                File directory = file.getParentFile();
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                file.createNewFile();
                
                // 빈 맵으로 초기화
                dictionaryData = new HashMap<>();
                objectMapper.writeValue(file, dictionaryData);
            } else {
                dictionaryData = objectMapper.readValue(file, 
                    new TypeReference<Map<String, DictionaryData>>() {});
            }
        } catch (IOException e) {
            dictionaryData = new HashMap<>();
        }
    }

    public void addWordToDictionary(String word, DictionaryData data) {
        if (word != null && data != null) {
            try {
                File file = new File(DICTIONARY_DATA_PATH);
                dictionaryData.put(word.toLowerCase(), data);
                objectMapper.writeValue(file, dictionaryData);
            } catch (IOException e) {
            }
        }
    }

    private DictionaryData findWordInDictionary(String word) {
        return dictionaryData.get(word.toLowerCase());
    }

    public DictionaryData getWord(String word) {
        if (word == null || word.trim().isEmpty()) {
            return null;
        }

        synchronized(fileLock) {
            try {
                File file = ensureCacheFileExists();
                Map<String, DictionaryData> cache = readCacheFile(file);
                
                // 캐시에서 단어 찾기
                DictionaryData cachedData = cache.get(word.toLowerCase());
                if (cachedData != null) {
                    updateLastAccessed(file, cache, cachedData);
                    return cachedData;
                }

                // 캐시에 없으면 원본 사전에서 검색
                DictionaryData dictionaryData = findWordInDictionary(word);
                if (dictionaryData != null) {
                    // 찾은 단어를 캐시에 저장
                    try {
                        if (file.length() > MAX_FILE_SIZE || cache.size() >= MAX_ENTRIES) {
                            cleanupOldEntries(cache);
                        }
                        dictionaryData.setLastAccessed(LocalDateTime.now());
                        cache.put(word.toLowerCase(), dictionaryData);
                        objectMapper.writeValue(file, cache);
                    } catch (IOException e) {
                    }
                }
                return dictionaryData;
            } catch (Exception e) {
                return findWordInDictionary(word);
            }
        }
    }

    private File ensureCacheFileExists() throws IOException {
        File file = new File(DICTIONARY_FILE_PATH);
        if (!file.exists()) {
            File directory = file.getParentFile();
            if (directory != null && !directory.exists()) {
                directory.mkdirs();
            }
            file.createNewFile();
            objectMapper.writeValue(file, new HashMap<String, DictionaryData>());
        }
        return file;
    }

    private Map<String, DictionaryData> readCacheFile(File file) throws IOException {
        try {
            return objectMapper.readValue(file, new TypeReference<Map<String, DictionaryData>>() {});
        } catch (IOException e) {
            System.err.println("Cache file corrupted, creating new one: " + e.getMessage());
            Map<String, DictionaryData> newCache = new HashMap<>();
            objectMapper.writeValue(file, newCache);
            return newCache;
        }
    }

    private void updateLastAccessed(File file, Map<String, DictionaryData> cache, DictionaryData data) {
        try {
            data.setLastAccessed(LocalDateTime.now());
            objectMapper.writeValue(file, cache);
        } catch (IOException e) {
            System.err.println("Failed to update last accessed time: " + e.getMessage());
        }
    }

    private void cleanupOldEntries(Map<String, DictionaryData> cache) {
        try {
            List<Map.Entry<String, DictionaryData>> entries = new ArrayList<>(cache.entrySet());
            entries.sort((a, b) -> {
                LocalDateTime timeA = a.getValue().getLastAccessed();
                LocalDateTime timeB = b.getValue().getLastAccessed();
                return timeB != null && timeA != null ? timeB.compareTo(timeA) : 0;
            });
            
            Map<String, DictionaryData> newCache = entries.stream()
                .limit(MAX_ENTRIES / 2)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                ));
            
            cache.clear();
            cache.putAll(newCache);
        } catch (Exception e) {
        }
    }

    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    public void monitorDiskSpace() {
        File file = new File(DICTIONARY_FILE_PATH);
        if (!file.exists()) return;

        long freeSpace = file.getFreeSpace();
        long totalSpace = file.getTotalSpace();
        double usagePercent = (totalSpace - freeSpace) * 100.0 / totalSpace;

        if (usagePercent > 90) {
            synchronized(fileLock) {
                try {
                    Map<String, DictionaryData> cache = readCacheFile(file);
                    cleanupOldEntries(cache);
                    objectMapper.writeValue(file, cache);
                } catch (IOException e) {
                }
            }
        }
    }
}