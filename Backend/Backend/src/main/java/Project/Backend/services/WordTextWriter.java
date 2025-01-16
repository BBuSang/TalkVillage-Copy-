package Project.Backend.services;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;

@Service  // 또는 @Component
public class WordTextWriter {

    // 영어 원본과 번역된 문장을 Word 파일로 저장
    public void saveTranslatedTextToWord(List<String> originalTexts, List<String> translatedTexts, String outputFilePath) throws IOException {
        // 새로운 Word 문서 생성
        XWPFDocument document = new XWPFDocument();
        FileOutputStream out = new FileOutputStream(outputFilePath);

        // 원본 문장과 번역된 문장을 함께 저장
        for (int i = 0; i < originalTexts.size(); i++) {
            // 문단 추가 (영어 원본)
            XWPFParagraph originalParagraph = document.createParagraph();
            originalParagraph.createRun().setText("Original: " + originalTexts.get(i));

            // 문단 추가 (번역된 한글)
            XWPFParagraph translatedParagraph = document.createParagraph();
            translatedParagraph.createRun().setText("Translated: " + translatedTexts.get(i));

            // 빈 줄 추가
            document.createParagraph();
        }

        // 파일 저장
        document.write(out);
        out.close();
        document.close();
    }
}
