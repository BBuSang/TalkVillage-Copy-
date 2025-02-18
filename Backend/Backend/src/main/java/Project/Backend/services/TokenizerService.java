//package Project.Backend.services;
//
//import java.io.InputStream;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import Project.Backend.entity.QuestionList;
//import Project.Backend.repository.QuestionListRepository;
//import opennlp.tools.tokenize.Tokenizer;
//import opennlp.tools.tokenize.TokenizerME;
//import opennlp.tools.tokenize.TokenizerModel;
//
//// 형태소 분석
//@Service
//public class TokenizerService {
//
//    private Tokenizer tokenizer;
//
//    @Autowired
//    private QuestionListRepository questionListRepository;
//    
//    public TokenizerService() {
//        try (InputStream modelIn = getClass().getResourceAsStream("/models/opennlp-en-ud-ewt-tokens-1.0-1.9.3.bin")) {
//            if (modelIn == null) {
//                throw new IllegalArgumentException("Model file not found!");
//            }
//            TokenizerModel model = new TokenizerModel(modelIn);
//            tokenizer = new TokenizerME(model);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    
//    public QuestionList addQuestionService(String stageLevel, String question, String result, String type) {
//        QuestionList newQuestion = new QuestionList();
//        newQuestion.setQuestionListId(null);
//        newQuestion.setStageLevel(stageLevel);
//        newQuestion.setQuestion(question);
//        newQuestion.setResult(result);
//        newQuestion.setType(type);
//        if(!(type.equalsIgnoreCase("blank"))) {        	
//        	newQuestion.setWrongData(null);
//        }
//        
//        return questionListRepository.save(newQuestion);
//    }
//    
//    
//    public String[] tokenize(String sentence) {
//        return tokenizer.tokenize(sentence);
//    }
//    
//    public List<QuestionList> questionService(String themeId){
//    	List<QuestionList> questionLists = questionListRepository.findByStageLevelStartingWithAndType(themeId, "sentence");
//    	
//    	return questionLists;
//    }
//}
// TokenizerService.java
package Project.Backend.services;

import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Project.Backend.entity.QuestionList;
import Project.Backend.repository.QuestionListRepository;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

@Service
public class TokenizerService {

    private Tokenizer tokenizer;

    @Autowired
    private QuestionListRepository questionListRepository;
    
    public TokenizerService() {
        try (InputStream modelIn = getClass().getResourceAsStream("/models/opennlp-en-ud-ewt-tokens-1.0-1.9.3.bin")) {
            if (modelIn == null) {
                throw new IllegalArgumentException("Model file not found!");
            }
            TokenizerModel model = new TokenizerModel(modelIn);
            tokenizer = new TokenizerME(model);
        } catch (Exception e) {
            e.printStackTrace(); 
        }
    }
    
    public QuestionList addQuestionService(String stageLevel, String question, String result, String type) {
        QuestionList newQuestion = new QuestionList();
        newQuestion.setQuestionListId(null);
        newQuestion.setStageLevel(stageLevel);
        newQuestion.setQuestion(question);
        newQuestion.setResult(result);
        newQuestion.setType(type);
        if(!(type.equalsIgnoreCase("blank"))) {        	
            newQuestion.setWrongData(null);
        }
        
        return questionListRepository.save(newQuestion);
    }
    
    public String[] tokenize(String sentence) {
        return tokenizer.tokenize(sentence); 
    }
    
    // 테마별 문제 조회
    public List<QuestionList> questionService(String themeId){
        List<QuestionList> questionLists = questionListRepository.findByStageLevelStartingWithAndType(themeId, "sentence");
        return questionLists;
    }

    // 난이도별 문제 조회
    public List<QuestionList> questionServiceByLevel(String stageId){
        // 모든 타입의 문제를 가져옴 (sentence, word, blank)
        List<QuestionList> questionLists = questionListRepository.findByStageLevelStartingWith(stageId);
        return questionLists;
    }
}