package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Clips;


@Repository
public interface ClipsRespository extends JpaRepository<Clips, Long> {
    Boolean existsByclipId(Long clipId);
    Clips findByclipId(Long clipId);
    @Query("SELECT c FROM Clips c WHERE c.sentence.sentence = :sentence ORDER BY c.clipId ASC")
    List<Clips> findAllBysentence_Sentence(@Param("sentence") String sentence);

}
