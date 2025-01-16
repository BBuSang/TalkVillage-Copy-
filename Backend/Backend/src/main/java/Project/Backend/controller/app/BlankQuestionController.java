// Project.Backend.controller.app.BlankQuestionController.java
package Project.Backend.controller.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Project.Backend.services.BlankQuestionService;
import Project.Backend.services.TokenizerService;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/question-manager")
public class BlankQuestionController {
	@Autowired
    private TokenizerService tokenizerService;

    @Autowired
    private BlankQuestionService blankQuestionService;
    
    @PostMapping("/generate-blank-options")
    public ResponseEntity<?> generateBlankOptions(
            @RequestParam("sentence") String sentence,
            @RequestParam("answer") String answer,
            @RequestParam("stageLevel") String stageLevel) {
//        tokenizerService.addQuestionService("1000-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1000-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1000-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1000-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1000-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1000-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1000-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1000-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1000-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1000-10", "When is the boarding time?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1001-01", "Can you show me to my seat?", "how", "sentence");
//        tokenizerService.addQuestionService("1001-02", "Can I have something to drink?", "flight", "sentence");
//        tokenizerService.addQuestionService("1001-03", "Can you tell me how to fill out?", "want", "sentence");
//        tokenizerService.addQuestionService("1001-04", "Can you move your seat forward?", "check", "sentence");
//        tokenizerService.addQuestionService("1001-05", "Do you have something for airsickness?", "next", "sentence");
//        tokenizerService.addQuestionService("1001-06", "I want to adjust this seat.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1001-07", "I want to change my seat.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1001-08", "I want to fill in this form.", "Open", "sentence");
//        tokenizerService.addQuestionService("1001-09", "When can the plain arrive?", "claim", "sentence");
//        tokenizerService.addQuestionService("1001-10", "Where is the toilet?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1002-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1002-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1002-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1002-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1002-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1002-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1002-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1002-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1002-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1002-10", "When is the boarding time?", "time", "sentence");
//         
//        tokenizerService.addQuestionService("1003-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1003-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1003-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1003-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1003-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1003-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1003-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1003-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1003-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1003-10", "When is the boarding time?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1004-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1004-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1004-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1004-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1004-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1004-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1004-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1004-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1004-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1004-10", "When is the boarding time?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1005-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1005-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1005-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1005-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1005-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1005-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1005-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1005-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1005-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1005-10", "When is the boarding time?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1006-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1006-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1006-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1006-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1006-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1006-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1006-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1006-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1006-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1006-10", "When is the boarding time?", "time", "sentence");
//
//        tokenizerService.addQuestionService("1007-01", "how are you?", "how", "sentence");
//        tokenizerService.addQuestionService("1007-02", "Do you have a flight to London from here?", "flight", "sentence");
//        tokenizerService.addQuestionService("1007-03", "I want to book a flight to Seoul.?", "want", "sentence");
//        tokenizerService.addQuestionService("1007-04", "I want to check in for Flight 123.", "check", "sentence");
//        tokenizerService.addQuestionService("1007-05", "When is the next flight?", "next", "sentence");
//        tokenizerService.addQuestionService("1007-06", "I want to check this baggage.", "baggage", "sentence");
//        tokenizerService.addQuestionService("1007-07", "It's fragile.", "fragile", "sentence");
//        tokenizerService.addQuestionService("1007-08", "Open your baggage.", "Open", "sentence");
//        tokenizerService.addQuestionService("1007-09", "Where is the baggage claim?", "claim", "sentence");
//        tokenizerService.addQuestionService("1007-10", "When is the boarding time?", "time", "sentence");
//    	tokenizerService.addQuestionService("1000-11", "apple,banana,forest", "forest", "word");
//    	tokenizerService.addQuestionService("1000-12", "cat,polise,tiger", "polise", "word");
//    	tokenizerService.addQuestionService("1000-13", "tower,forest,apple", "tower", "word");
        try {
            List<String> wrongOptions = blankQuestionService.generateWrongOptions(answer);
            
            if (wrongOptions.size() < 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("충분한 오답을 생성할 수 없습니다.");
            }

            return ResponseEntity.ok(Map.of(
                "sentence", sentence,
                "answer", answer,
                "wrongOptions", wrongOptions,
                "stageLevel", stageLevel
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("오답 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
        
    }
}