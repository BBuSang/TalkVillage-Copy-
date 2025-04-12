package Project.Backend.services;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Project.Backend.entity.Exam;
import Project.Backend.repository.ExamRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamService {
    private final ExamRepository examRepository;
    private static final String EXAM_SHEET = "Sheet1";
    private static final String WORD_TEST_SHEET = "WordTest";

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long id) {
        
        // 먼저 전체 데이터 확인
        List<Exam> allExams = examRepository.findAll();
        System.out.println(allExams.stream()
                .map(e -> e.getExamId() + "(" + e.getSheetName() + ")")
                .collect(Collectors.joining(", ")));
        
        // Sheet1에서 찾기
        Exam exam = examRepository.findByExamIdAndSheetName(id, EXAM_SHEET);
        
        // Sheet1에서 찾지 못하면 WordTest에서 찾기
        if (exam == null) {
            exam = examRepository.findByExamIdAndSheetName(id, WORD_TEST_SHEET);
        }
        
        // 둘 다 없으면 전체에서 찾기
        if (exam == null) {
            exam = examRepository.findByExamId(id);
        }
        
        return exam;
    }

    public Exam getWordTestById(Long id) {
        return examRepository.findByExamIdAndSheetName(id, WORD_TEST_SHEET);
    }

    public List<Exam> getExamsByType(String type) {
        return examRepository.findByExamTypeOrderByExamIdDesc(type);
    }

    public List<Exam> getAllExamQuestions() {
        return examRepository.findBySheetName(EXAM_SHEET);
    }

    public List<Exam> getAllWordTestQuestions() {
        return examRepository.findBySheetName(WORD_TEST_SHEET);
    }

    public int getExamCount() {
        return examRepository.countBySheetName(EXAM_SHEET);
    }

    public int getWordTestCount() {
        return examRepository.countBySheetName(WORD_TEST_SHEET);
    }

    public List<Exam> getExamsByTypeAndSheet(String type, String sheetName) {
        return examRepository.findBySheetNameAndExamType(sheetName, type);
    }

    public Exam getExamByIdAndTypeAndSheet(Long id, String type, String sheetName) {
        return examRepository.findByExamIdAndSheetNameAndExamType(id, sheetName, type);
    }
}	