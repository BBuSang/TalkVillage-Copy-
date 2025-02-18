//package Project.Backend.controller.app;
//
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import Project.Backend.entity.QuestionList;
//import Project.Backend.repository.QuestionListRepository;
//import Project.Backend.services.TokenizerService;
//
////형태소 분석
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
//public class TokenizerController {
//	
//    @Autowired
//    private TokenizerService tokenizerService;
//
////    @PostMapping("/tokenize")
////    public String[] tokenize(@RequestBody String sentence) {
////    	
////        return tokenizerService.tokenize(sentence);
////    }
//    
//    @PostMapping("/tokenize")
//    public Map<String, List<String>> tokenizeQuestion(@RequestBody Map<String, String> payload) {
//        String questionText = payload.get("question");	
//
//        // 형태소 분석 로직 (예: 단어별로 나누기)
//        List<String> tokens = Arrays.asList(questionText.split(" "));
//
//        return Collections.singletonMap("tokens", tokens);
//    }
//    
//    @PostMapping("/questions")
//    public List<QuestionList> selectquestion(@RequestParam("themeId") String themeId){
//    	
//    	//tokenizerService.addQuestionService("1000-01", "lion,tiger,monkey", "monkey", "word");
//    	
//    	List<QuestionList> questionLists = tokenizerService.questionService(themeId);
//    	
//    	List<String> questions = questionLists.stream()
//                .map(QuestionList::getQuestion)  // stageLevel 필드 getter 메서드 사용
//                .collect(Collectors.toList());
//    	//questions.forEach(System.out::println);
//    	
//    	return questionLists;
//    }
//    
//}
// TokenizerController.java
package Project.Backend.controller.app;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.entity.QuestionList;
import Project.Backend.services.TokenizerService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TokenizerController {
    
    @Autowired
    private TokenizerService tokenizerService;
    
    @PostMapping("/tokenize")
    public Map<String, List<String>> tokenizeQuestion(@RequestBody Map<String, String> payload) {
        String questionText = payload.get("question");    
        List<String> tokens = Arrays.asList(questionText.split(" "));
        return Collections.singletonMap("tokens", tokens);
    }
    
    // 테마별 문제 조회
    @PostMapping("/ThemeQuestions")
    public List<QuestionList> selectQuestionByTheme(@RequestParam("themeId") String themeId){
        List<QuestionList> questionLists = tokenizerService.questionService(themeId);
        return questionLists;
    }

    // 난이도별 문제 조회
    @PostMapping("/LevelQuestions")
    public List<QuestionList> selectQuestionByLevel(@RequestParam("stageId") String stageId){
        List<QuestionList> questionLists = tokenizerService.questionServiceByLevel(stageId);
        return questionLists;
    }
}