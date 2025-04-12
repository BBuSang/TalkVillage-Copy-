package Project.Backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    @Query("SELECT e FROM Exam e WHERE e.examId = :examId")
    Exam findByExamId(@Param("examId") Long examId);
    
    @Query("SELECT e FROM Exam e WHERE e.examId = :examId AND e.sheetName = :sheetName")
    Exam findByExamIdAndSheetName(@Param("examId") Long examId, @Param("sheetName") String sheetName);
    
    @Query("SELECT COUNT(e) FROM Exam e WHERE e.sheetName = :sheetName")
    int countBySheetName(@Param("sheetName") String sheetName);
    
    @Query("SELECT e FROM Exam e WHERE e.sheetName = :sheetName")
    List<Exam> findBySheetName(@Param("sheetName") String sheetName);
    
    // 기존 메서드들
    List<Exam> findByExamType(String examType);
    List<Exam> findByExamTypeOrderByExamIdDesc(String examType);
    Exam findByExamIdAndExamType(Long examId, String examType);
    List<Exam> findBySheetNameAndExamType(String sheetName, String examType);
    Exam findByExamIdAndSheetNameAndExamType(Long examId, String sheetName, String examType);
}