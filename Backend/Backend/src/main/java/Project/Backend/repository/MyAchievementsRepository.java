package Project.Backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.classes.UD;
import Project.Backend.entity.AchievementsList;
import Project.Backend.entity.MyAchievements;
import Project.Backend.entity.User;

@Repository
public interface MyAchievementsRepository extends JpaRepository<MyAchievements, Long>{
	List<MyAchievements> findByUser(User user);
	MyAchievements findByUserAndAchievementsList(User user, AchievementsList achievementsList);
	MyAchievements findByAchievementsListAndUser(AchievementsList achievementsList, User user);
}
