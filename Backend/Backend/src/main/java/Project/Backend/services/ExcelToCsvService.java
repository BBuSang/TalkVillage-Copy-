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

@Service
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
            throw new RuntimeException("엑셀 파일 초기화 실패", e);
        }
    }

    @Transactional
    public void reloadExcelFile() {
        try {
            lastProcessedSheets.clear();
            questionListRepository.deleteAll();
            processedWordCount = 0;
            currentWord = "";

            String absolutePath = new File("src/main/resources/excel/TalkVillageQuestions.xlsx").getAbsolutePath();
            excelFile = new File(absolutePath);

            if (!excelFile.exists()) {
                throw new RuntimeException("엑셀 파일을 찾을 수 없습니다: " + absolutePath);
            }

            Thread.sleep(1000);

            try (FileInputStream fis = new FileInputStream(excelFile)) {
                XSSFWorkbook workbook = new XSSFWorkbook(fis);
                convertExcelToCsv();
                saveAllToDatabase();
                workbook.close();
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("엑셀 파일 리로드 실패: " + e.getMessage());
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
                        
                        String[] headers = {"stageLevel", "question", "result", "wrongData", "type"};
                        csvWriter.writeNext(headers);
                        
                        Iterator<Row> rowIterator = sheet.iterator();
                        rowIterator.next();
                        
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
                }
                
                return lastProcessedSheets;
            }
        } catch (IOException e) {
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

        } catch (IOException e) {
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
}