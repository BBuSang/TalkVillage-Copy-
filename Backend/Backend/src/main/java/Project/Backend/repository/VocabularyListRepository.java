package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.VocabularyList;

@Repository
public interface VocabularyListRepository extends JpaRepository<VocabularyList, Long> {
    
    // 사용자의 모든 단어 목록을 ID 역순으로 조회
    List<VocabularyList> findByUserUserIdOrderByVocabularyListIdDesc(Long userId);
    
    // 특정 사용자의 특정 단어를 조회 (권한 확인용)
    VocabularyList findByVocabularyListIdAndUserUserId(Long vocabularyListId, Long userId);
}