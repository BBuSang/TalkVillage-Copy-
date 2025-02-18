package Project.Backend.controller.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.DictionaryData;
import Project.Backend.services.DictionaryCacheService;
import Project.Backend.services.TranslationService;

@RestController
@RequestMapping("/api/dictionarycache")
@CrossOrigin(origins = "http://localhost:3000")
public class DictionaryCacheController {
    
    private final DictionaryCacheService cacheService;
    private final TranslationService translationService;
    
    @Autowired
    public DictionaryCacheController(DictionaryCacheService cacheService, TranslationService translationService) {
        this.cacheService = cacheService;
        this.translationService = translationService;
    }
    
    @GetMapping("/search")
    public ResponseEntity<DictionaryData> getFromCache(@RequestParam String word) {
        try {
            DictionaryData cachedData = cacheService.getWord(word);
            if (cachedData != null) {
                return ResponseEntity.ok(cachedData);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addToCache(@RequestParam String word, @RequestBody DictionaryData data) {
        try {
            cacheService.addWordToDictionary(word, data);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/translate")
    public ResponseEntity<?> translate(@RequestBody TranslationRequest request) {
        try {
            String translatedText = translationService.translate(
                request.getText(), 
                request.getTarget_lang()
            );
            return ResponseEntity.ok(new TranslationResponse(translatedText));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

class TranslationRequest {
    private String text;
    private String target_lang;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTarget_lang() {
        return target_lang;
    }

    public void setTarget_lang(String target_lang) {
        this.target_lang = target_lang;
    }
}

class TranslationResponse {
    private String translatedText;
    
    public TranslationResponse(String translatedText) {
        this.translatedText = translatedText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }
}