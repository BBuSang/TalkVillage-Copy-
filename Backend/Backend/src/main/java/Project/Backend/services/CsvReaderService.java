package Project.Backend.services;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

@Service
public class CsvReaderService {
    
    public List<Map<String, String>> readCsvFile(String sheetName) throws IOException, CsvValidationException {
        List<Map<String, String>> records = new ArrayList<>();
        String csvPath = "src/main/resources/csv/" + sheetName + ".csv";
        
        File csvFile = new File(csvPath);
        if (!csvFile.exists()) {
            throw new IOException("CSV 파일을 찾을 수 없습니다: " + sheetName);
        }
        
        try (CSVReader reader = new CSVReader(new FileReader(csvFile))) {
            String[] headers = reader.readNext();
            if (headers == null) {
                throw new IOException("CSV 파일이 비어있습니다: " + sheetName);
            }
            
            String[] line;
            while ((line = reader.readNext()) != null) {
                Map<String, String> record = new HashMap<>();
                for (int i = 0; i < headers.length; i++) {
                    record.put(headers[i], i < line.length ? line[i] : "");
                }
                records.add(record);
            }
        }
        
        return records;
    }
}