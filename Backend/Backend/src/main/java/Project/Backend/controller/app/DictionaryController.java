package Project.Backend.controller.app;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.services.DictionaryService;

// merriam test
// http://localhost:9999/define?word=apple
//@RestController
//public class DictionaryController {
//
//    @Autowired
//    private DictionaryService dictionaryService;
//
//    @GetMapping("/define")
//    public String getDefinition(@RequestParam String word) {
//        try {
//            return dictionaryService.getWordDefinition(word);
//        } catch (IOException e) {
//            return "Error occurred: " + e.getMessage();
//        }
//    }
//}

// merriam + deepl 결합
//@RestController
//public class DictionaryController {
//
//    @Autowired
//    private DictionaryService dictionaryService;
//
//    @GetMapping("/define")
//    public String getDefinition(@RequestParam String word, @RequestParam String targetLang) {
//        try {
//            return dictionaryService.getWordDefinitionWithTranslation(word, targetLang);
//        } catch (IOException e) {
//            return "Error occurred: " + e.getMessage();
//        }
//    }
//}

// @RestController
// @CrossOrigin(origins = "http://localhost:3000")
// public class DictionaryController {

//     @Autowired
//     private DictionaryService dictionaryService;

//     @GetMapping("/define")
//     @ResponseBody
//     public String getDefinition(@RequestParam String word) {
//         try {
//             return dictionaryService.getWordDefinitionAndExamples(word);
//         } catch (IOException e) {
//             return "<h2>Error occurred: " + e.getMessage() + "</h2>";
//         }
//     }
// }

//@RestController
//@CrossOrigin(origins = "http://localhost:3000")
//public class DictionaryController {
//
//    private final DictionaryService dictionaryService;
//
//    public DictionaryController(DictionaryService dictionaryService) {
//        this.dictionaryService = dictionaryService;
//    }
//
//    @GetMapping("/define")
//    public Map<String, Object> getDefinition(@RequestParam String word) throws IOException {
//        Map<String, Object> response = new HashMap<>();
//
//        // DictionaryService에서 단어 정의 및 예문을 가져오는 메서드 호출
//        Map<String, Object> definitionData = dictionaryService.getWordDefinitionAndExamples(word);
//
//        // 단어와 정의 데이터를 response에 추가
//        response.put("word", word);
//        response.putAll(definitionData);
//
//        return response;  // Map<String, Object>를 반환하여 JSON 형식으로 응답
//    }
//}

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DictionaryController {
    private final DictionaryService dictionaryService;

    public DictionaryController(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    @GetMapping("/define")
    public ResponseEntity<Map<String, Object>> getDefinition(@RequestParam String word) {
        try {
            Map<String, Object> response = dictionaryService.getWordDefinitionAndExamples(word);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}
