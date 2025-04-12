package Project.Backend.controller.app;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.opencsv.exceptions.CsvValidationException;

import Project.Backend.classes.CsvData;
import Project.Backend.services.CsvReaderService;
import Project.Backend.services.ExamExcelToCsvService;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private final ExamExcelToCsvService examExcelToCsvService;
    private final CsvReaderService csvReaderService;

    public FileController(ExamExcelToCsvService examExcelToCsvService, CsvReaderService csvReaderService) {
        this.examExcelToCsvService = examExcelToCsvService;
        this.csvReaderService = csvReaderService;
    }

    @GetMapping("/convert")
    public ResponseEntity<?> convertExcelToCsv() {
        try {
            List<String> sheets = examExcelToCsvService.convertExcelToCsv();
            return ResponseEntity.ok(Map.of(
                "message", "엑셀 파일이 성공적으로 CSV로 변환되었습니다.",
                "sheets", sheets
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/sync")
    public ResponseEntity<?> synchronizeExcel(@RequestParam String fileName) {
        try {
            examExcelToCsvService.reloadExcelFile(fileName);
            List<String> sheetNames = examExcelToCsvService.getAvailableSheetNames();
            return ResponseEntity.ok(Map.of(
                "message", "엑셀 파일이 성공적으로 동기화되었습니다.",
                "sheets", sheetNames
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/csv/{sheetName}")
    public ResponseEntity<?> readCsvFile(@PathVariable String sheetName) {
        try {
            List<Map<String, String>> data = csvReaderService.readCsvFile(sheetName);
            return ResponseEntity.ok(data);
        } catch (IOException | CsvValidationException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/update-wrong-data")
    public ResponseEntity<?> updateWrongData(@RequestParam String sheetName, @RequestBody List<CsvData> updatedData) {
        try {
            examExcelToCsvService.updateExcelWithWrongData(sheetName, updatedData);
            return ResponseEntity.ok(Map.of("message", "엑셀 파일이 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save-to-database")
    public ResponseEntity<?> saveToDatabase() {
        try {
            examExcelToCsvService.saveAllToDatabase();
            return ResponseEntity.ok(Map.of("message", "모든 데이터가 성공적으로 저장되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/sheets")
    public ResponseEntity<List<String>> getSheetNames() {
        return ResponseEntity.ok(examExcelToCsvService.getAvailableSheetNames());
    }

    @GetMapping("/current-file")
    public ResponseEntity<String> getCurrentFileName() {
        return ResponseEntity.ok(examExcelToCsvService.getCurrentFileName());
    }
}