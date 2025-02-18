package Project.Backend.controller.app;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.services.BlankQuestionService;
import Project.Backend.services.TokenizerService;

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