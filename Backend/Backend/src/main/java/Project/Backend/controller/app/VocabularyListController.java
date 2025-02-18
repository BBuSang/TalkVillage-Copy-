package Project.Backend.controller.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.VocabularyList;
import Project.Backend.services.VocabularyListService;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "http://localhost:3000")
public class VocabularyListController {
    
    @Autowired
    private VocabularyListService vocabularyListService;
    
    @GetMapping("/list")
    public ResponseEntity<List<VocabularyList>> getVocabularyList(@AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).body(null);
        }
        
        // findByUserUserIdOrderByVocabularyListIdDesc로 수정
        List<VocabularyList> vocabularyList = vocabularyListService.findByUserUserIdOrderByVocabularyListIdDesc(user.getUser().getUserId());
        return ResponseEntity.ok(vocabularyList);
    }
    
    @PostMapping("")
    public ResponseEntity<VocabularyList> addVocabulary(
            @RequestParam String wordEN,
            @RequestParam String wordKO,
            @AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        try {  // try-catch 블록 추가
            VocabularyList newWord = vocabularyListService.addVocabulary(
                wordEN,
                wordKO,
                user.getUser()
            );
            return ResponseEntity.ok(newWord);
        } catch (Exception e) {
            e.printStackTrace(); // 로그 확인을 위해
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/bookmark/{vocabularyListId}")
    public ResponseEntity<Void> updateBookmarkState(
            @PathVariable Long vocabularyListId,
            @RequestParam Boolean bookmarkState,
            @AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        vocabularyListService.updateBookmarkState(vocabularyListId, bookmarkState);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{vocabularyListId}")
    public ResponseEntity<Void> updateVocabulary(
            @PathVariable Long vocabularyListId,
            @RequestParam String wordEN,
            @RequestParam String wordKO,
            @AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            vocabularyListService.updateVocabulary(
                vocabularyListId, 
                wordEN, 
                wordKO, 
                user.getUser().getUserId()
            );
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
    
    @DeleteMapping("/{vocabularyListId}")
    public ResponseEntity<Void> deleteVocabulary(
            @PathVariable Long vocabularyListId,
            @AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        vocabularyListService.deleteVocabulary(vocabularyListId);
        return ResponseEntity.ok().build();
    }
}