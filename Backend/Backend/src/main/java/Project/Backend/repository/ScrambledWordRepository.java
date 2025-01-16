package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.ScrambledWord;

@Repository
public interface ScrambledWordRepository extends JpaRepository<ScrambledWord, Long>{
	ScrambledWord findByWord(String word);
}
