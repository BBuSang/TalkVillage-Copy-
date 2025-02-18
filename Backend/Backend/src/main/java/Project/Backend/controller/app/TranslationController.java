package Project.Backend.controller.app;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import Project.Backend.classes.UD;
import Project.Backend.services.TranslationService;

@CrossOrigin(origins = "http://localhost:3000" , allowCredentials = "true") 
@RestController
@RequestMapping("/api")
public class TranslationController {

    @Autowired
    private TranslationService translationService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/auth/check")
    public ResponseEntity<?> checkLoginStatus(@AuthenticationPrincipal UD user) {
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("isLoggedIn", true);
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        }
        response.put("isLoggedIn", false);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/translate")
    public ResponseEntity<?> translate(@RequestBody Map<String, Object> request) {
        try {

            Object textObj = request.get("text");
            String targetLang = (String) request.get("target_lang");

            if (textObj == null) {
                return ResponseEntity.badRequest().body("번역할 텍스트가 없습니다.");
            }

            // Object를 String으로 변환
            String text = objectMapper.writeValueAsString(textObj);
            
            if (targetLang == null || targetLang.trim().isEmpty()) {
                targetLang = "KO";
            }

            String translatedText = translationService.translate(text, targetLang);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("translatedText", translatedText));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("번역 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}