package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.HangmanGameWord;

@Repository
public interface HangmanGameWordRepository extends JpaRepository<HangmanGameWord, Long>{
	@Query("SELECT h.Word FROM HangmanGameWord h")
    List<String> findAllWords();
}
