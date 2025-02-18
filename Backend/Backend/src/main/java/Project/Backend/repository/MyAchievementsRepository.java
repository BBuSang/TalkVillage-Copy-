package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyAchievements;

@Repository
public interface MyAchievementsRepository extends JpaRepository<MyAchievements, Long>{

}
