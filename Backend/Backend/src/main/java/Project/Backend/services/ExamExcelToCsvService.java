package Project.Backend.services;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileOutputStream;
//import java.io.FileWriter;
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.Iterator;
//import java.util.List;
//import java.util.Set;
//
//import org.apache.poi.ss.usermodel.Cell;
//import org.apache.poi.ss.usermodel.DateUtil;
//import org.apache.poi.ss.usermodel.Row;
//import org.apache.poi.xssf.usermodel.XSSFSheet;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.opencsv.CSVWriter;
//import Project.Backend.classes.CsvData;
//import Project.Backend.controller.app.QuestionManagerController;
//import Project.Backend.entity.Exam;
//import Project.Backend.entity.QuestionList;
//import Project.Backend.repository.ExamRepository;
//import Project.Backend.repository.QuestionListRepository;
//import jakarta.annotation.PostConstruct;
//
//@Service
//public class ExamExcelToCsvService {
//    private List<String> lastProcessedSheets = new ArrayList<>();
//    private final ExamRepository examRepository;
//    private final QuestionListRepository questionListRepository;
//    private final QuestionManagerController questionManagerController;
//    
//    // 파일 이름 상수
//    private static final String TALK_VILLAGE_FILE = "TalkVillageQuestions.xlsx";
//    private static final String EXAM_FILE = "ExamList.xlsx";
//    private static final String CSV_DIR = "src/main/resources/csv";
//    private File excelFile;
//    
//    private static final String[] TALK_VILLAGE_HEADERS = {"stageLevel", "question", "result", "wrongData", "type"};
//    private static final String[] EXAM_HEADERS = {"exam_id", "type", "question", "passage", "option1", "option2", "option3", "option4", "correct_answer"};
//    
//    private String[] currentHeaders;
//    private String currentFileName;
//
//    private int totalWordCount = 0;
//    private int processedWordCount = 0;
//    private String currentWord = "";
//
//    public int getTotalWordCount() { return totalWordCount; }
//    public int getProcessedWordCount() { return processedWordCount; }
//    public String getCurrentWord() { return currentWord; }
//
//    public ExamExcelToCsvService(
//        ExamRepository examRepository,
//        QuestionListRepository questionListRepository,
//        QuestionManagerController questionManagerController
//    ) {
//        this.examRepository = examRepository;
//        this.questionListRepository = questionListRepository;
//        this.questionManagerController = questionManagerController;
//    }
//
//    @PostConstruct
//    public void init() {
//        try {
//            // 기본값으로 TalkVillage 파일 로드
//            initializeExcel(TALK_VILLAGE_FILE);
//        } catch (Exception e) {
//            try {
//                // TalkVillage 파일이 없으면 Exam 파일 시도
//                initializeExcel(EXAM_FILE);
//            } catch (Exception ex) {
//                throw new RuntimeException("엑셀 파일 초기화 실패", ex);
//            }
//        }
//    }
//
//    private String[] getHeadersByFileName(String fileName) {
//        if (fileName.contains("TalkVillageQuestions")) {
//            return TALK_VILLAGE_HEADERS;
//        } else if (fileName.contains("ExamList")) {
//            return EXAM_HEADERS;
//        }
//        throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + fileName);
//    }
//
//    public void initializeExcel(String excelFileName) {
//        try {
//            currentFileName = excelFileName;
//            currentHeaders = getHeadersByFileName(excelFileName);
//            ClassPathResource resource = new ClassPathResource("excel/" + excelFileName);
//            excelFile = resource.getFile();
//            convertExcelToCsv();
//        } catch (IOException e) {
//            throw new RuntimeException("엑셀 파일 초기화 실패: " + excelFileName, e);
//        }
//    }
//
//    public void reloadExcelFile(String excelFileName) {
//        try {
//            lastProcessedSheets.clear();
//            processedWordCount = 0;
//            currentWord = "";
//            currentFileName = excelFileName;
//            currentHeaders = getHeadersByFileName(excelFileName);
//
//            String absolutePath = new File("src/main/resources/excel/" + excelFileName).getAbsolutePath();
//            excelFile = new File(absolutePath);
//
//            if (!excelFile.exists()) {
//                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다: " + absolutePath);
//            }
//
//            try (FileInputStream fis = new FileInputStream(excelFile)) {
//                XSSFWorkbook workbook = new XSSFWorkbook(fis);
//                convertExcelToCsv();
//                workbook.close();
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("엑셀 파일 리로드 실패: " + e.getMessage(), e);
//        }
//    }
//
//    public List<String> convertExcelToCsv() {
//        try {
//            File csvDir = new File(CSV_DIR);
//            if (!csvDir.exists()) {
//                csvDir.mkdirs();
//            }
//
//            if (!excelFile.exists()) {
//                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다.");
//            }
//
//            try (FileInputStream fis = new FileInputStream(excelFile);
//                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
//                
//                lastProcessedSheets.clear();
//
//                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
//                    XSSFSheet sheet = workbook.getSheetAt(i);
//                    String sheetName = sheet.getSheetName();
//                    lastProcessedSheets.add(sheetName);
//                    String csvFileName = CSV_DIR + "/" + sheetName + ".csv";
//                    
//                    try (FileWriter fileWriter = new FileWriter(csvFileName);
//                         CSVWriter csvWriter = new CSVWriter(fileWriter)) {
//                        
//                        csvWriter.writeNext(currentHeaders);
//                        
//                        Iterator<Row> rowIterator = sheet.iterator();
//                        rowIterator.next();
//                        
//                        while (rowIterator.hasNext()) {
//                            Row row = rowIterator.next();
//                            String[] csvRow = new String[currentHeaders.length];
//                            
//                            for (int j = 0; j < currentHeaders.length; j++) {
//                                Cell cell = row.getCell(j);
//                                csvRow[j] = getCellValue(cell);
//                            }
//                            
//                            csvWriter.writeNext(csvRow);
//                        }
//                    }
//                }
//                
//                return lastProcessedSheets;
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("CSV 변환 실패", e);
//        }
//    }
//
//    @Transactional
//    public void saveAllToDatabase() {
//        if (currentFileName.equals(EXAM_FILE)) {
//            saveExamToDatabase();
//        } else if (currentFileName.equals(TALK_VILLAGE_FILE)) {
//            saveTalkVillageToDatabase();
//        }
//    }
//
//    private void saveExamToDatabase() {
//        try {
//            examRepository.deleteAll();
//            
//            try (FileInputStream fis = new FileInputStream(excelFile);
//                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
//                
//                List<Exam> exams = new ArrayList<>();
//
//                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
//                    XSSFSheet sheet = workbook.getSheetAt(i);
//                    Iterator<Row> rowIterator = sheet.iterator();
//                    rowIterator.next(); // 헤더 건너뛰기
//                    
//                    while (rowIterator.hasNext()) {
//                        Row row = rowIterator.next();
//                        Exam exam = new Exam();
//                        
//                        exam.setExamId(Long.parseLong(getCellValue(row.getCell(0))));
//                        exam.setExamType(getCellValue(row.getCell(1)));
//                        exam.setExamQuestion(getCellValue(row.getCell(2)));
//                        exam.setPassage(getCellValue(row.getCell(3)));
//                        exam.setOption1(getCellValue(row.getCell(4)));
//                        exam.setOption2(getCellValue(row.getCell(5)));
//                        exam.setOption3(getCellValue(row.getCell(6)));
//                        exam.setOption4(getCellValue(row.getCell(7)));
//                        exam.setCorrectAnswer(getCellValue(row.getCell(8)));
//                        
//                        exams.add(exam);
//                    }
//                }
//                
//                examRepository.saveAll(exams);
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("Exam 데이터베이스 저장 실패", e);
//        }
//    }
//
//    private void saveTalkVillageToDatabase() {
//        try {
//            processedWordCount = 0;
//            currentWord = "";
//            Set<String> wordTypeQuestions = new HashSet<>();
//
//            try (FileInputStream fis = new FileInputStream(excelFile);
//                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
//                
//                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
//                    XSSFSheet sheet = workbook.getSheetAt(i);
//                    Iterator<Row> rowIterator = sheet.iterator();
//                    rowIterator.next();
//                    
//                    while (rowIterator.hasNext()) {
//                        Row row = rowIterator.next();
//                        String type = getCellValue(row.getCell(4));
//                        if ("word".equals(type)) {
//                            String words = getCellValue(row.getCell(1));
//                            if (!imageExists(words)) {
//                                wordTypeQuestions.add(words);
//                            }
//                        }
//                    }
//                }
//            }
//
//            totalWordCount = wordTypeQuestions.size();
//            questionListRepository.deleteAll();
//
//            try (FileInputStream fis = new FileInputStream(excelFile);
//                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
//                
//                List<QuestionList> questions = new ArrayList<>();
//                Set<String> processedWords = new HashSet<>();
//
//                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
//                    XSSFSheet sheet = workbook.getSheetAt(i);
//                    Iterator<Row> rowIterator = sheet.iterator();
//                    rowIterator.next();
//                    
//                    while (rowIterator.hasNext()) {
//                        Row row = rowIterator.next();
//                        QuestionList question = new QuestionList();
//                        
//                        question.setStageLevel(getCellValue(row.getCell(0)));
//                        question.setQuestion(getCellValue(row.getCell(1)));
//                        question.setResult(getCellValue(row.getCell(2)));
//                        question.setWrongData(getCellValue(row.getCell(3)));
//                        question.setType(getCellValue(row.getCell(4)));
//                        
//                        if ("word".equals(question.getType())) {
//                            String words = question.getQuestion();
//                            if (!imageExists(words) && !processedWords.contains(words)) {
//                                try {
//                                    currentWord = words;
//                                    questionManagerController.generateImages(words, question.getStageLevel());
//                                    processedWords.add(words);
//                                    processedWordCount++;
//                                } catch (Exception e) {
//                                    // 이미지 생성 실패 처리
//                                }
//                            }
//                        }
//                        
//                        questions.add(question);
//                    }
//                }
//                
//                questionListRepository.saveAll(questions);
//            }
//            
//        } catch (IOException e) {
//            throw new RuntimeException("TalkVillage 데이터베이스 저장 실패", e);
//        }
//    }
//
//    public void updateExcelWithWrongData(String sheetName, List<CsvData> updatedData) {
//        try {
//            XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(excelFile));
//            XSSFSheet sheet = workbook.getSheet(sheetName);
//            
//            if (sheet == null) {
//                throw new RuntimeException("시트를 찾을 수 없습니다: " + sheetName);
//            }
//
//            Iterator<Row> rowIterator = sheet.iterator();
//            if (!rowIterator.hasNext()) {
//                throw new RuntimeException("빈 시트입니다: " + sheetName);
//            }
//            rowIterator.next();
//
//            int rowIndex = 1;
//            for (CsvData data : updatedData) {
//                Row row = sheet.getRow(rowIndex);
//                if (row == null) {
//                    row = sheet.createRow(rowIndex);
//                }
//                updateRow(row, data);
//                rowIndex++;
//            }
//
//            try (FileOutputStream fileOut = new FileOutputStream(excelFile)) {
//                workbook.write(fileOut);
//            }
//
//            updateCsvFile(sheetName, updatedData);
//            workbook.close();
//
//        } catch (IOException e) {
//            throw new RuntimeException("엑셀 파일 업데이트 실패", e);
//        }
//    }
//
//    private void updateRow(Row row, CsvData data) {
//        if (currentHeaders.equals(EXAM_HEADERS)) {
//            // Exam 형식 업데이트
//            row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getExamId());
//            row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getType());
//            row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getQuestion());
//            row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getPassage());
//            row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption1());
//            row.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption2());
//            row.getCell(6, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption3());
//            row.getCell(7, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption4());
//            row.getCell(8, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getCorrectAnswer());
//        } else {
//            // TalkVillage 형식 업데이트
//            row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getStageLevel());
//            row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getQuestion());
//            row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getResult());
//            row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getWrongData());
//            row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getType());
//        }
//    }
//
//    private void updateCsvFile(String sheetName, List<CsvData> updatedData) throws IOException {
//        String csvPath = CSV_DIR + "/" + sheetName + ".csv";
//        try (FileWriter fileWriter = new FileWriter(csvPath);
//             CSVWriter csvWriter = new CSVWriter(fileWriter)) {
//            
//            csvWriter.writeNext(currentHeaders);
//            
//            for (CsvData data : updatedData) {
//                String[] row;
//                if (currentHeaders.equals(EXAM_HEADERS)) {
//                    row = new String[]{
//                        data.getExamId(),
//                        data.getType(),
//                        data.getQuestion(),
//                        data.getPassage(),
//                        data.getOption1(),
//                        data.getOption2(),
//                        data.getOption3(),
//                        data.getOption4(),
//                        data.getCorrectAnswer()
//                    };
//                } else {
//                    row = new String[]{
//                        data.getStageLevel(),
//                        data.getQuestion(),
//                        data.getResult(),
//                        data.getWrongData(),
//                        data.getType()
//                    };
//                }
//                csvWriter.writeNext(row);
//            }
//        }
//    }
//
//    private boolean imageExists(String words) {
//        String[] wordList = words.split(",");
//        
//        for (String word : wordList) {
//            String baseImagePath = "src/main/resources/static/images/" + word.trim();
//            String[] extensions = {".png", ".jpg", ".jpeg"};
//            boolean wordHasImage = false;
//            
//            for (String ext : extensions) {
//                File imageFile = new File(baseImagePath + ext);
//                if (imageFile.exists()) {
//                    wordHasImage = true;
//                    break;
//                }
//            }
//            
//            if (!wordHasImage) {
//                return false;
//            }
//        }
//        
//        return true;
//    }
//
//    public List<String> getAvailableSheetNames() {
//        return lastProcessedSheets;
//    }
//
//    private String getCellValue(Cell cell) {
//        if (cell == null) return "";
//        
//        switch (cell.getCellType()) {
//            case STRING:
//                return cell.getStringCellValue();
//            case NUMERIC:
//                if (DateUtil.isCellDateFormatted(cell)) {
//                    return cell.getLocalDateTimeCellValue().toString();
//                }
//                return String.valueOf((int)cell.getNumericCellValue());
//            case BOOLEAN:
//                return String.valueOf(cell.getBooleanCellValue());
//            case FORMULA:
//                return cell.getCellFormula();
//            default:
//                return "";
//        }
//    }
//
//    public String getCurrentFileName() {
//        return currentFileName;
//    }
//}


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
import Project.Backend.entity.Exam;
import Project.Backend.entity.QuestionList;
import Project.Backend.repository.ExamRepository;
import Project.Backend.repository.QuestionListRepository;
import jakarta.annotation.PostConstruct;

@Service
public class ExamExcelToCsvService {
    private List<String> lastProcessedSheets = new ArrayList<>();
    private final ExamRepository examRepository;
    private final QuestionListRepository questionListRepository;
    private final QuestionManagerController questionManagerController;
    
    // 파일 이름 상수
    private static final String TALK_VILLAGE_FILE = "TalkVillageQuestions.xlsx";
    private static final String EXAM_FILE = "ExamList.xlsx";
    private static final String CSV_DIR = "src/main/resources/csv";
    private File excelFile;
    
    private static final String[] TALK_VILLAGE_HEADERS = {"stageLevel", "question", "result", "wrongData", "type"};
    private static final String[] EXAM_HEADERS = {"exam_id", "type", "question", "passage", "option1", "option2", "option3", "option4", "correct_answer"};
    private static final String EXAM_SHEET = "Sheet1";
    private static final String WORD_TEST_SHEET = "WordTest";
    
    private String[] currentHeaders;
    private String currentFileName;

    private int totalWordCount = 0;
    private int processedWordCount = 0;
    private String currentWord = "";

    public int getTotalWordCount() { return totalWordCount; }
    public int getProcessedWordCount() { return processedWordCount; }
    public String getCurrentWord() { return currentWord; }
    public String getCurrentFileName() { return currentFileName; }

    public ExamExcelToCsvService(
        ExamRepository examRepository,
        QuestionListRepository questionListRepository,
        QuestionManagerController questionManagerController
    ) {
        this.examRepository = examRepository;
        this.questionListRepository = questionListRepository;
        this.questionManagerController = questionManagerController;
    }

    @PostConstruct
    public void init() {
        try {
            initializeExcel(TALK_VILLAGE_FILE);
        } catch (Exception e) {
            try {
                initializeExcel(EXAM_FILE);
            } catch (Exception ex) {
                throw new RuntimeException("엑셀 파일 초기화 실패", ex);
            }
        }
    }

    private String[] getHeadersByFileName(String fileName) {
        if (fileName.contains("TalkVillageQuestions")) {
            return TALK_VILLAGE_HEADERS;
        } else if (fileName.contains("ExamList")) {
            return EXAM_HEADERS;
        }
        throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + fileName);
    }
    public void initializeExcel(String excelFileName) {
        try {
            currentFileName = excelFileName;
            currentHeaders = getHeadersByFileName(excelFileName);
            ClassPathResource resource = new ClassPathResource("excel/" + excelFileName);
            excelFile = resource.getFile();
            convertExcelToCsv();
        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 초기화 실패: " + excelFileName, e);
        }
    }

    public void reloadExcelFile(String excelFileName) {
        try {
            lastProcessedSheets.clear();
            processedWordCount = 0;
            currentWord = "";
            currentFileName = excelFileName;
            currentHeaders = getHeadersByFileName(excelFileName);

            String absolutePath = new File("src/main/resources/excel/" + excelFileName).getAbsolutePath();
            excelFile = new File(absolutePath);

            if (!excelFile.exists()) {
                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다: " + absolutePath);
            }

            try (FileInputStream fis = new FileInputStream(excelFile)) {
                XSSFWorkbook workbook = new XSSFWorkbook(fis);
                convertExcelToCsv();
                saveAllToDatabase();
                workbook.close();
            }
        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 리로드 실패: " + e.getMessage(), e);
        }
    }

    public List<String> convertExcelToCsv() {
        try {
            File csvDir = new File(CSV_DIR);
            if (!csvDir.exists()) {
                csvDir.mkdirs();
            }

            if (!excelFile.exists()) {
                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다.");
            }

            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                lastProcessedSheets.clear();

                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    String sheetName = sheet.getSheetName();
                    lastProcessedSheets.add(sheetName);
                    String csvFileName = CSV_DIR + "/" + sheetName + ".csv";
                    
                    try (FileWriter fileWriter = new FileWriter(csvFileName);
                         CSVWriter csvWriter = new CSVWriter(fileWriter)) {
                        
                        csvWriter.writeNext(currentHeaders);
                        
                        Iterator<Row> rowIterator = sheet.iterator();
                        rowIterator.next(); // 헤더 건너뛰기
                        
                        while (rowIterator.hasNext()) {
                            Row row = rowIterator.next();
                            String[] csvRow = new String[currentHeaders.length];
                            
                            for (int j = 0; j < currentHeaders.length; j++) {
                                Cell cell = row.getCell(j);
                                csvRow[j] = getCellValue(cell);
                            }
                            
                            csvWriter.writeNext(csvRow);
                        }
                    }
                }
                
                return lastProcessedSheets;
            }
        } catch (IOException e) {
            throw new RuntimeException("CSV 변환 실패", e);
        }
    }

    @Transactional
    public void saveAllToDatabase() {
        if (currentFileName.equals(EXAM_FILE)) {
            saveExamToDatabase();
        } else if (currentFileName.equals(TALK_VILLAGE_FILE)) {
            saveTalkVillageToDatabase();
        }
    }
    private void saveExamToDatabase() {
        try {
            examRepository.deleteAll();
            
            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                List<Exam> exams = new ArrayList<>();

                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    String sheetName = sheet.getSheetName();
                    
                    
                    if (sheetName.equals(EXAM_SHEET) || sheetName.equals(WORD_TEST_SHEET)) {
                        Iterator<Row> rowIterator = sheet.iterator();
                        
                        // 헤더 확인
                        if (rowIterator.hasNext()) {
                            Row headerRow = rowIterator.next();
                        }
                        
                        while (rowIterator.hasNext()) {
                            Row row = rowIterator.next();
                            try {
                                String examIdStr = getCellValue(row.getCell(0));
                                if (examIdStr == null || examIdStr.trim().isEmpty()) {
                                    continue;
                                }

                                Exam exam = new Exam();
                                exam.setExamId(Long.parseLong(examIdStr));
                                exam.setExamType(getCellValue(row.getCell(1)));
                                exam.setExamQuestion(getCellValue(row.getCell(2)));
                                exam.setPassage(getCellValue(row.getCell(3)));
                                exam.setOption1(getCellValue(row.getCell(4)));
                                exam.setOption2(getCellValue(row.getCell(5)));
                                exam.setOption3(getCellValue(row.getCell(6)));
                                exam.setOption4(getCellValue(row.getCell(7)));
                                exam.setCorrectAnswer(getCellValue(row.getCell(8)));
                                exam.setSheetName(sheetName);
                                
                                exams.add(exam);
                            } catch (Exception e) {
                                System.err.println("행 처리 중 오류 발생: " + e.getMessage());
                                e.printStackTrace();
                            }
                        }
                    }
                }
                
                examRepository.saveAll(exams);
                
            }
        } catch (IOException e) {
            System.err.println("Exam 데이터베이스 저장 실패: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Exam 데이터베이스 저장 실패", e);
        }
    }
    private boolean isEmptyRow(Row row) {
        if (row == null) return true;
        for (int i = 0; i < 9; i++) {
            if (!getCellValue(row.getCell(i)).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private void saveTalkVillageToDatabase() {
        try {
            processedWordCount = 0;
            currentWord = "";
            Set<String> wordTypeQuestions = new HashSet<>();

            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    Iterator<Row> rowIterator = sheet.iterator();
                    rowIterator.next();
                    
                    while (rowIterator.hasNext()) {
                        Row row = rowIterator.next();
                        String type = getCellValue(row.getCell(4));
                        if ("word".equals(type)) {
                            String words = getCellValue(row.getCell(1));
                            if (!imageExists(words)) {
                                wordTypeQuestions.add(words);
                            }
                        }
                    }
                }
            }
            totalWordCount = wordTypeQuestions.size();
            questionListRepository.deleteAll();

            try (FileInputStream fis = new FileInputStream(excelFile);
                 XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
                
                List<QuestionList> questions = new ArrayList<>();
                Set<String> processedWords = new HashSet<>();

                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    XSSFSheet sheet = workbook.getSheetAt(i);
                    Iterator<Row> rowIterator = sheet.iterator();
                    rowIterator.next();
                    
                    while (rowIterator.hasNext()) {
                        Row row = rowIterator.next();
                        QuestionList question = new QuestionList();
                        
                        question.setStageLevel(getCellValue(row.getCell(0)));
                        question.setQuestion(getCellValue(row.getCell(1)));
                        question.setResult(getCellValue(row.getCell(2)));
                        question.setWrongData(getCellValue(row.getCell(3)));
                        question.setType(getCellValue(row.getCell(4)));
                        
                        if ("word".equals(question.getType())) {
                            String words = question.getQuestion();
                            if (!imageExists(words) && !processedWords.contains(words)) {
                                try {
                                    currentWord = words;
                                    questionManagerController.generateImages(words, question.getStageLevel());
                                    processedWords.add(words);
                                    processedWordCount++;
                                } catch (Exception e) {
                                    // 이미지 생성 실패 처리
                                }
                            }
                        }
                        
                        questions.add(question);
                    }
                }
                
                questionListRepository.saveAll(questions);
            }
            
        } catch (IOException e) {
            throw new RuntimeException("TalkVillage 데이터베이스 저장 실패", e);
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
                updateRow(row, data);
                rowIndex++;
            }

            try (FileOutputStream fileOut = new FileOutputStream(excelFile)) {
                workbook.write(fileOut);
            }

            updateCsvFile(sheetName, updatedData);
            workbook.close();

        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 업데이트 실패", e);
        }
    }

    private void updateRow(Row row, CsvData data) {
        if (currentHeaders.equals(EXAM_HEADERS)) {
            row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getExamId());
            row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getType());
            row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getQuestion());
            row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getPassage());
            row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption1());
            row.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption2());
            row.getCell(6, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption3());
            row.getCell(7, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getOption4());
            row.getCell(8, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getCorrectAnswer());
        } else {
            row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getStageLevel());
            row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getQuestion());
            row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getResult());
            row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getWrongData());
            row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(data.getType());
        }
    }

    private void updateCsvFile(String sheetName, List<CsvData> updatedData) throws IOException {
        String csvPath = CSV_DIR + "/" + sheetName + ".csv";
        try (FileWriter fileWriter = new FileWriter(csvPath);
             CSVWriter csvWriter = new CSVWriter(fileWriter)) {
            
            csvWriter.writeNext(currentHeaders);
            
            for (CsvData data : updatedData) {
                String[] row;
                if (currentHeaders.equals(EXAM_HEADERS)) {
                    row = new String[]{
                        data.getExamId(),
                        data.getType(),
                        data.getQuestion(),
                        data.getPassage(),
                        data.getOption1(),
                        data.getOption2(),
                        data.getOption3(),
                        data.getOption4(),
                        data.getCorrectAnswer()
                    };
                } else {
                    row = new String[]{
                        data.getStageLevel(),
                        data.getQuestion(),
                        data.getResult(),
                        data.getWrongData(),
                        data.getType()
                    };
                }
                csvWriter.writeNext(row);
            }
        }
    }

    private boolean imageExists(String words) {
        String[] wordList = words.split(",");
        
        for (String word : wordList) {
            String baseImagePath = "src/main/resources/static/images/" + word.trim();
            String[] extensions = {".png", ".jpg", ".jpeg"};
            boolean wordHasImage = false;
            
            for (String ext : extensions) {
                File imageFile = new File(baseImagePath + ext);
                if (imageFile.exists()) {
                    wordHasImage = true;
                    break;
                }
            }
            
            if (!wordHasImage) {
                return false;
            }
        }
        
        return true;
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
}