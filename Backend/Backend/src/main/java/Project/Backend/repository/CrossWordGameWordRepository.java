package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.CrossWordGameWord;

@Repository
public interface CrossWordGameWordRepository extends JpaRepository<CrossWordGameWord, Long>{

}
