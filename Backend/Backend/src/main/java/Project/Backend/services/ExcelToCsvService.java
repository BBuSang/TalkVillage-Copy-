package Project.Backend.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opencsv.CSVWriter;

import Project.Backend.classes.CsvData;
import Project.Backend.controller.app.QuestionManagerController;
import Project.Backend.entity.QuestionList;
import Project.Backend.repository.QuestionListRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExcelToCsvService {
    private List<String> lastProcessedSheets = new ArrayList<>();
    private static final String EXCEL_FILE_NAME = "excel/TalkVillageQuestions.xlsx";
    private static final String CSV_DIR = "src/main/resources/csv";
    private File excelFile;
    private final QuestionListRepository questionListRepository;
    private final QuestionManagerController questionManagerController;

    private int totalWordCount = 0;
    private int processedWordCount = 0;
    private String currentWord = "";

    public int getTotalWordCount() { return totalWordCount; }
    public int getProcessedWordCount() { return processedWordCount; }
    public String getCurrentWord() { return currentWord; }

    public ExcelToCsvService(
        QuestionListRepository questionListRepository,
        QuestionManagerController questionManagerController
    ) {
        this.questionListRepository = questionListRepository;
        this.questionManagerController = questionManagerController;
    }

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource(EXCEL_FILE_NAME);
            excelFile = resource.getFile();
            convertExcelToCsv();
        } catch (IOException e) {
            log.error("엑셀 파일 초기화 실패", e);
            throw new RuntimeException("엑셀 파일 초기화 실패", e);
        }
    }

    @Transactional
    public void reloadExcelFile() {
        try {
            // 기존 데이터 초기화
            lastProcessedSheets.clear();
            questionListRepository.deleteAll();
            processedWordCount = 0;
            currentWord = "";

            // 엑셀 파일 경로 직접 지정 (절대 경로 사용)
            String absolutePath = new File("src/main/resources/excel/TalkVillageQuestions.xlsx").getAbsolutePath();
            excelFile = new File(absolutePath);

            if (!excelFile.exists()) {
                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다: " + absolutePath);
            }

            log.info("엑셀 파일 로드: {}", absolutePath);

            // 파일 읽기 전에 약간의 지연 추가
            Thread.sleep(1000);

            // 워크북 새로 열기
            try (FileInputStream fis = new FileInputStream(excelFile)) {
                XSSFWorkbook workbook = new XSSFWorkbook(fis);
                
                // CSV 변환 및 데이터베이스 업데이트
                convertExcelToCsv();
                saveAllToDatabase();
                
                workbook.close();
            }
            
            log.info("Excel file reloaded and synchronized successfully");
        } catch (IOException | InterruptedException e) {
            log.error("Failed to reload Excel file", e);
            throw new RuntimeException("Failed to reload Excel file: " + e.getMessage());
        }
    }

    public List<String> convertExcelToCsv() {
        try {
            File csvDir = new File(CSV_DIR);
            if (!csvDir.exists()) {
                csvDir.mkdirs();
            }

            if (!excelFile.exists()) {
                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다: " + EXCEL_FILE_NAME);
            }

            // 워크북 새로 열기
            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                lastProcessedSheets.clear(); // 기존 시트 목록 초기화

                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    String sheetName = sheet.getSheetName();
                    lastProcessedSheets.add(sheetName);
                    String csvFileName = CSV_DIR + "/" + sheetName + ".csv";
                    
                    // CSV 파일 새로 생성
                    try (FileWriter fileWriter = new FileWriter(csvFileName);
                         CSVWriter csvWriter = new CSVWriter(fileWriter)) {
                        
                        String[] headers = {"stageLevel", "question", "result", "wrongData", "type"};
                        csvWriter.writeNext(headers);
                        
                        Iterator<Row> rowIterator = sheet.iterator();
                        rowIterator.next(); // 헤더 건너뛰기
                        
                        while (rowIterator.hasNext()) {
                            Row row = rowIterator.next();
                            String[] csvRow = new String[5];
                            
                            for (int j = 0; j < 5; j++) {
                                Cell cell = row.getCell(j);
                                csvRow[j] = getCellValue(cell);
                            }
                            
                            csvWriter.writeNext(csvRow);
                        }
                    }
                    log.info("시트 '{}' 를 CSV 파일로 변환 완료: {}", sheetName, csvFileName);
                }
                
                return lastProcessedSheets;
            }
        } catch (IOException e) {
            log.error("CSV 변환 실패", e);
            throw new RuntimeException("CSV 변환 실패", e);
        }
    }

    public void updateExcelWithWrongData(String sheetName, List<CsvData> updatedData) {
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(excelFile));
            XSSFSheet sheet = workbook.getSheet(sheetName);
            
            if (sheet == null) {
                throw new RuntimeException("시트를 찾을 수 없습니다: " + sheetName);
            }

            Iterator<Row> rowIterator = sheet.iterator();
            if (!rowIterator.hasNext()) {
                throw new RuntimeException("빈 시트입니다: " + sheetName);
            }
            rowIterator.next();

            int rowIndex = 1;
            for (CsvData data : updatedData) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    row = sheet.createRow(rowIndex);
                }

                row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getStageLevel());
                row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getQuestion());
                row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getResult());
                row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getWrongData());
                row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getType());

                rowIndex++;
            }

            try (FileOutputStream fileOut = new FileOutputStream(excelFile)) {
                workbook.write(fileOut);
            }

            updateCsvFile(sheetName, updatedData);
            workbook.close();
            
            log.info("엑셀 파일과 CSV 파일 업데이트 완료: {}", sheetName);

        } catch (IOException e) {
            log.error("파일 업데이트 실패", e);
            throw new RuntimeException("엑셀 파일 업데이트 실패", e);
        }
    }

    private void updateCsvFile(String sheetName, List<CsvData> updatedData) throws IOException {
        String csvPath = CSV_DIR + "/" + sheetName + ".csv";
        try (FileWriter fileWriter = new FileWriter(csvPath);
             CSVWriter csvWriter = new CSVWriter(fileWriter)) {
            
            String[] headers = {"stageLevel", "question", "result", "wrongData", "type"};
            csvWriter.writeNext(headers);
            
            for (CsvData data : updatedData) {
                String[] row = {
                    data.getStageLevel(),
                    data.getQuestion(),
                    data.getResult(),
                    data.getWrongData(),
                    data.getType()
                };
                csvWriter.writeNext(row);
            }
        }
    }
    @Transactional
    public void saveAllToDatabase() {
        try {
            // 초기화
            processedWordCount = 0;
            currentWord = "";
            Set<String> wordTypeQuestions = new HashSet<>();

            // 먼저 전체 word 타입 문제 수 계산 (이미지가 없는 것만)
            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    Iterator<Row> rowIterator = sheet.iterator();
                    rowIterator.next(); // 헤더 건너뛰기
                    
                    while (rowIterator.hasNext()) {
                        Row row = rowIterator.next();
                        String type = getCellValue(row.getCell(4)); // type 컬럼
                        if ("word".equals(type)) {
                            String words = getCellValue(row.getCell(1)); // question 컬럼
                            String stageLevel = getCellValue(row.getCell(0)); // stageLevel 컬럼
                            
                            //log.info("단어 체크 시작: {} (스테이지: {})", words, stageLevel);
                            boolean exists = imageExists(words);
                            //log.info("이미지 존재 여부 최종 결과: {} - {}", words, exists);
                            
                            // 이미지가 없는 경우에만 카운트에 추가
                            if (!exists) {
                                wordTypeQuestions.add(words);
                                log.info("이미지 생성 필요 단어로 추가: {}", words);
                            } else {
                                log.info("이미지 이미 존재, 건너뜀: {}", words);
                            }
                        }
                    }
                }
            }

            totalWordCount = wordTypeQuestions.size();
            //log.info("이미지 생성이 필요한 총 단어 수: {}", totalWordCount);
            //log.info("생성이 필요한 단어들: {}", String.join(", ", wordTypeQuestions));

            //log.info("기존 QuestionList 데이터 삭제 시작");
            questionListRepository.deleteAll();
            //log.info("기존 QuestionList 데이터 삭제 완료");

            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                List<QuestionList> questions = new ArrayList<>();
                Set<String> processedWords = new HashSet<>();

                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    Iterator<Row> rowIterator = sheet.iterator();
                    rowIterator.next(); // 헤더 건너뛰기
                    
                    while (rowIterator.hasNext()) {
                        Row row = rowIterator.next();
                        QuestionList question = new QuestionList();
                        
                        question.setStageLevel(getCellValue(row.getCell(0)));
                        question.setQuestion(getCellValue(row.getCell(1)));
                        question.setResult(getCellValue(row.getCell(2)));
                        question.setWrongData(getCellValue(row.getCell(3)));
                        question.setType(getCellValue(row.getCell(4)));
                        
                        // word 타입 문제의 이미지 생성 (이미지가 없는 경우에만)
                        if ("word".equals(question.getType())) {
                            String words = question.getQuestion();
                            
                            if (!imageExists(words) && !processedWords.contains(words)) {
                                try {
                                    currentWord = words;
                                    log.info("이미지 생성 중 ({}/{}): {}", 
                                        processedWordCount + 1, totalWordCount, words);
                                    questionManagerController.generateImages(words, question.getStageLevel());
                                    processedWords.add(words);
                                    processedWordCount++;
                                } catch (Exception e) {
                                    //log.error("이미지 생성 실패 - 단어들: {}", words, e);
                                }
                            } else {
                                //log.info("이미지가 이미 존재하거나 이미 처리됨, 건너뜀: {}", words);
                            }
                        }
                        
                        questions.add(question);
                    }
                }
                
                questionListRepository.saveAll(questions);
                //log.info("엑셀 데이터를 데이터베이스에 새로 저장했습니다. 총 {}개", questions.size());
            }
            
        } catch (IOException e) {
            log.error("데이터베이스 초기화 중 오류 발생", e);
            throw new RuntimeException("데이터베이스 초기화 실패", e);
        }
    }
    public List<String> getAvailableSheetNames() {
        return lastProcessedSheets;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                }
                return String.valueOf((int)cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    private boolean imageExists(String words) {
        // 콤마로 구분된 단어들을 분리
        String[] wordList = words.split(",");
        
        // 각 단어별로 이미지 존재 여부 확인
        for (String word : wordList) {
            String baseImagePath = "src/main/resources/static/images/" + word.trim();
            String[] extensions = {".png", ".jpg", ".jpeg"};
            boolean wordHasImage = false;
            
            for (String ext : extensions) {
                File imageFile = new File(baseImagePath + ext);
                if (imageFile.exists()) {
                    log.info("이미지 발견: {} ({})", word.trim(), imageFile.getName());
                    wordHasImage = true;
                    break;
                }
            }
            
            // 하나의 단어라도 이미지가 없으면 false 반환
            if (!wordHasImage) {
                log.info("이미지 없음: {}", word.trim());
                return false;
            }
        }
        
        // 모든 단어에 대해 이미지가 있으면 true 반환
        log.info("모든 단어에 대한 이미지 존재: {}", words);
        return true;
    }
}