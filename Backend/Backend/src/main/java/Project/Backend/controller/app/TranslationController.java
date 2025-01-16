package Project.Backend.controller.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.services.TranslationService;

// @RestController
// @RequestMapping("/translate")
// public class TranslationController {

//     @Autowired
//     private WordTranslationService wordTranslationService;

//     @PostMapping("/word")
//     public ResponseEntity<String> translateWordFile(@RequestParam("file") MultipartFile file, @RequestParam("lang") String lang) throws IOException {
//         System.out.println("POST request received at /translate/word");

//         if (file.isEmpty()) {
//             return new ResponseEntity<>("No file uploaded", HttpStatus.BAD_REQUEST);
//         }

//         try {
//             // 임시 파일로 Word 파일 저장
//             File tempFile = File.createTempFile("uploaded", ".docx");
//             file.transferTo(tempFile);  // 업로드된 파일을 임시 파일로 변환

//             // 출력 파일 경로 설정 (자동 생성)
//             String outputFilePath = tempFile.getAbsolutePath().replace(".docx", "_translated.docx");

//             // 번역 작업
//             wordTranslationService.translateWordFile(tempFile.getAbsolutePath(), outputFilePath, lang);

//             return new ResponseEntity<>("Translated file saved to: " + outputFilePath, HttpStatus.OK);
//         } catch (IOException e) {
//             e.printStackTrace();  // 에러 로그 출력
//             return new ResponseEntity<>("File processing failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//     }
// }



@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api")
public class TranslationController {

    @Autowired
    private TranslationService translationService; 

    @PostMapping("/translate")
    public String translate(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String targetLang = request.get("target_lang");
        return translationService.translate(text, targetLang);
    }
}
