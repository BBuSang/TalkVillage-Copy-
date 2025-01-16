// package Project.Backend.controller.app;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import Project.Backend.services.DeepLTranslationService;

// @RestController
// public class TranslationTestController {

//     @Autowired
//     private DeepLTranslationService deepLTranslationService;

//     @GetMapping("/test-translate")
//     public String testTranslate(@RequestParam("text") String text) {
//         String lang = "KO"; // 기본적으로 한국어로 번역
//         String translation = deepLTranslationService.translateText(text, lang);
//         return translation; // 번역 결과 반환
//     }
// }
