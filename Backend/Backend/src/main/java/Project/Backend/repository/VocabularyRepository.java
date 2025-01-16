package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.VocabularyList;

@Repository
public interface VocabularyRepository extends JpaRepository<VocabularyList, Long>{

}
