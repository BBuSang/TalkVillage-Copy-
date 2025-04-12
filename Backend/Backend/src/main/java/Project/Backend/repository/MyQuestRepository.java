package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyQuest;
import Project.Backend.entity.Quest;
import Project.Backend.entity.User;

@Repository
public interface MyQuestRepository extends JpaRepository<MyQuest, Long>{
	List<MyQuest> findByUser(User user);
}
