package Project.Backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Project.Backend.entity.User;
import Project.Backend.entity.VocabularyList;
import Project.Backend.repository.VocabularyListRepository;

//VocabularyListService.java
@Service
public class VocabularyListService {
 
	@Autowired
    private VocabularyListRepository vocabularyListRepository;
    
    // getVocabularyListByUserId에서 findByUserUserIdOrderByVocabularyListIdDesc로 수정
    public List<VocabularyList> findByUserUserIdOrderByVocabularyListIdDesc(Long userId) {
        return vocabularyListRepository.findByUserUserIdOrderByVocabularyListIdDesc(userId);
    }
 
	 @Transactional  // 트랜잭션 추가
	 public VocabularyList addVocabulary(String wordEN, String wordKO, User user) {
	     try {
	         VocabularyList vocabulary = new VocabularyList();
	         vocabulary.setWordEN(wordEN);
	         vocabulary.setWordKO(wordKO);
	         vocabulary.setUser(user);
	         vocabulary.setBookmarkState(false);
	         
	         // null 체크 추가
	         if (wordEN == null || wordKO == null || user == null) {
	             throw new IllegalArgumentException("필수 값이 누락되었습니다.");
	         }
	         
	         return vocabularyListRepository.save(vocabulary);
	     } catch (Exception e) {
	         e.printStackTrace(); // 로그 확인을 위해
	         throw new RuntimeException("단어 추가 중 오류가 발생했습니다: " + e.getMessage());
	     }
	 }
	 
	 @Transactional
	 public void updateBookmarkState(Long vocabularyListId, Boolean bookmarkState) {
	     VocabularyList vocabulary = vocabularyListRepository.findById(vocabularyListId)
	         .orElseThrow(() -> new RuntimeException("단어를 찾을 수 없습니다."));
	     vocabulary.setBookmarkState(bookmarkState);
	     vocabularyListRepository.save(vocabulary);
	 }
	 
	 @Transactional
	 public void updateVocabulary(Long vocabularyListId, String wordEN, String wordKO, Long userId) {
	     VocabularyList vocabulary = vocabularyListRepository.findByVocabularyListIdAndUserUserId(vocabularyListId, userId);
	     
	     if (vocabulary == null) {
	         throw new RuntimeException("단어를 찾을 수 없거나 수정 권한이 없습니다.");
	     }
	
	     vocabulary.setWordEN(wordEN);
	     vocabulary.setWordKO(wordKO);
	     vocabularyListRepository.save(vocabulary);
	 }
	 
	 @Transactional
	 public void deleteVocabulary(Long vocabularyListId) {
	     vocabularyListRepository.deleteById(vocabularyListId);
	 }
	}