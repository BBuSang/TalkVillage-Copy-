package Project.Backend.classes;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

public class WordTextExtractor {

    // Word 파일에서 영어 문장을 추출
    public List<String> extractTextFromWord(String filePath) throws IOException {
        FileInputStream fis = new FileInputStream(filePath);
        XWPFDocument document = new XWPFDocument(fis);

        // 모든 문단을 읽어 리스트로 저장
        List<XWPFParagraph> paragraphs = document.getParagraphs();
        List<String> extractedTexts = new ArrayList<>();

        for (XWPFParagraph paragraph : paragraphs) {
            extractedTexts.add(paragraph.getText());
        }

        document.close();
        return extractedTexts;
    }
}
