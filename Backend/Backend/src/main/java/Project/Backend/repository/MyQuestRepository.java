package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyQuest;

@Repository
public interface MyQuestRepository extends JpaRepository<MyQuest, Long>{

}
