package Project.Backend.controller.app;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.entity.Exam;
import Project.Backend.services.ExamExcelToCsvService;
import Project.Backend.services.ExamService;

@RestController
@RequestMapping("/api/exam")
@CrossOrigin(origins = "http://localhost:3000")
public class ExaminationController {
    private final ExamService examService;
    private final ExamExcelToCsvService excelToCsvService;

    public ExaminationController(ExamService examService, ExamExcelToCsvService excelToCsvService) {
        this.examService = examService;
        this.excelToCsvService = excelToCsvService;
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<Exam> getExamQuestion(@PathVariable Long id) {
        try {
            Exam exam = examService.getExamById(id);
            
            if (exam != null) {
                return ResponseEntity.ok(exam);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/word-test/{id}")
    public ResponseEntity<Exam> getWordTestQuestion(@PathVariable Long id) {
        try {
            Exam exam = examService.getWordTestById(id);
            
            if (exam != null) {
                return ResponseEntity.ok(exam);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/start-ids")
    public ResponseEntity<Map<String, Long>> getStartIds() {
        try {
            List<Exam> sentenceExams = examService.getAllExamQuestions();
            List<Exam> wordExams = examService.getAllWordTestQuestions();
            
            Map<String, Long> startIds = new HashMap<>();
            startIds.put("sentenceStartId", 
                sentenceExams.stream()
                    .mapToLong(Exam::getExamId)
                    .min()
                    .orElse(0));
            startIds.put("wordStartId", 
                wordExams.stream()
                    .mapToLong(Exam::getExamId)
                    .min()
                    .orElse(0));
                    
            return ResponseEntity.ok(startIds);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Integer>> getExamCounts() {
        try {
            Map<String, Integer> counts = new HashMap<>();
            counts.put("examCount", examService.getExamCount());
            counts.put("wordTestCount", examService.getWordTestCount());
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/temp/load-initial-data")
    public ResponseEntity<String> loadInitialData() {
        try {
            System.out.println("Starting initial data load...");
            excelToCsvService.initializeExcel("ExamList.xlsx");
            excelToCsvService.convertExcelToCsv();
            excelToCsvService.saveAllToDatabase();
            
            List<Exam> allExams = examService.getAllExams();
            System.out.println("Total loaded exams: " + allExams.size());
            System.out.println("Available exam IDs: " + 
                allExams.stream()
                    .map(e -> e.getExamId() + "(" + e.getSheetName() + ")")
                    .collect(Collectors.joining(", ")));
            
            return ResponseEntity.ok("데이터베이스 적재 완료. 총 " + allExams.size() + "개의 데이터가 로드됨");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("데이터베이스 적재 실패: " + e.getMessage());
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Exam>> getExamsByType(@PathVariable String type) {
        try {
            List<Exam> exams = examService.getExamsByType(type);
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Exam>> getAllExamQuestions() {
        try {
            List<Exam> exams = examService.getAllExamQuestions();
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/word-test")
    public ResponseEntity<List<Exam>> getAllWordTestQuestions() {
        try {
            List<Exam> exams = examService.getAllWordTestQuestions();
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/debug/questions")
    public ResponseEntity<?> debugExamQuestions() {
        try {
            Map<String, Object> debug = new HashMap<>();
            debug.put("totalCount", examService.getAllExams().size());
            debug.put("examCount", examService.getExamCount());
            debug.put("wordTestCount", examService.getWordTestCount());
            debug.put("firstExam", examService.getExamById(1L));
            debug.put("allExams", examService.getAllExamQuestions());
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("디버그 정보 조회 실패: " + e.getMessage());
        }
    }
}
