package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.AchievementsList;

@Repository
public interface AchievementsListRepository extends JpaRepository<AchievementsList, Long>{
	boolean existsByContent(String content);
	List<AchievementsList> findByType(String type);
	AchievementsList findByTitle(String title);
}
