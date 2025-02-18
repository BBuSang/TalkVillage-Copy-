package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Sentences;

@Repository
public interface SentencesRepository extends JpaRepository<Sentences, Long> {
    Sentences findBysentenceId(Long sentenceId);
    Boolean existsBysentenceId(Long sentenceId);
}
