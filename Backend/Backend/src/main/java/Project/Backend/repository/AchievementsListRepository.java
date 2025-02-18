package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.AchievementsList;

@Repository
public interface AchievementsListRepository extends JpaRepository<AchievementsList, Long>{

}
