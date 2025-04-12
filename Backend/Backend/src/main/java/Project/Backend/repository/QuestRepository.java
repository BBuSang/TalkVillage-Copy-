package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Quest;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long>{
	boolean existsByTitle(String title);
}
