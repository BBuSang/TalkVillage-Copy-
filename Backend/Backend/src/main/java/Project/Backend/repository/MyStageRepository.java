package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyStage;
import Project.Backend.entity.User;

@Repository
public interface MyStageRepository extends JpaRepository<MyStage, Long>{
	public MyStage findByuser (User user);
	boolean existsByUser(User user);

}
