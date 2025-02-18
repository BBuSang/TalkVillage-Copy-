package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.QuestionList;

@Repository
public interface QuestionListRepository extends JpaRepository<QuestionList, Long>{
	List<QuestionList> findByStageLevelStartingWith(String stageLevel);
	List<QuestionList> findTop1ByTypeOrderByQuestionListIdAsc(String type);
	List<QuestionList> findByStageLevelAndType(String stageLevel, String type);
	List<QuestionList> findByStageLevelStartingWithAndType(String stageLevel, String type);

//	@Query("SELECT q FROM QuestionList q WHERE q.stageLevel LIKE :stagePrefix% AND q.type = :type")
//    List<QuestionList> findByStageLevelStartingWithAndType(@Param("stagePrefix") String stagePrefix, @Param("type") String type);
}
