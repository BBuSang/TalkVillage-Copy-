package Project.Backend.controller.api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Project.Backend.classes.UD;
import Project.Backend.entity.ScrambledWord;
import Project.Backend.entity.User;
import Project.Backend.repository.ScrambledWordRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.AchieveService;
import Project.Backend.services.RewardService;

@RestController
@RequestMapping("/api/ScrambledWord")
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정
public class ScrambledWordController {

    @Autowired
    private ScrambledWordRepository wordRepository;

    @Autowired
    UserRepository userRep;
    
    @Autowired
    AchieveService achieveService;
    
    @Autowired
    RewardService rewardService;

    // 랜덤하게 섞인 단어를 반환 (GET 요청)
    @GetMapping("/scrambled")
    public ScrambledWord getScrambledWord() {
        List<ScrambledWord> words = wordRepository.findAll();
        if (words.isEmpty()) {
            return new ScrambledWord("No words available", "No hint available");
        }

        ScrambledWord selectedWord = words.get(new Random().nextInt(words.size()));
        String scrambled = shuffleString(selectedWord.getWord()).toLowerCase(); // 단어를 랜덤하게 섞음

        return new ScrambledWord(scrambled, selectedWord.getWord(), selectedWord.getHint());
    }

    // 문자열을 랜덤하게 섞는 메서드
    private String shuffleString(String input) {
        List<Character> characters = input.chars().mapToObj(c -> (char) c).collect(Collectors.toList()); // 문자열을 문자 리스트로 변환
        Collections.shuffle(characters); // 리스트를 랜덤하게 섞음

        StringBuilder scrambled = new StringBuilder();
        characters.forEach(scrambled::append); // 섞인 문자들을 다시 하나의 문자열로 결합
        return scrambled.toString();
    }

    @GetMapping("/hint")
    public String getHint(@RequestParam String word) {
        // findByWord 메서드를 사용하여 단어 찾기
        ScrambledWord scrambledWord = wordRepository.findByWord(word);

        if (scrambledWord != null) {
            return scrambledWord.getHint();
        } else {
            return "No hint available";
        }
    }

    // 단어 목록 전체 반환
    @GetMapping("/list")
    public List<ScrambledWord> getAllWords() {
        return wordRepository.findAll();
    }

    // 단어 추가
 // 단어 추가
    @PostMapping("/addwords")
    public ResponseEntity<?> addWords(@RequestBody List<Map<String, String>> wordDataList) {
        try {
            // 입력값 검증
            if (wordDataList == null || wordDataList.isEmpty()) {
                return ResponseEntity.badRequest().body("단어 목록이 비어있습니다.");
            }

            List<ScrambledWord> scrambledWords = new ArrayList<>();
            List<String> existingWords = wordRepository.findAll().stream()
                    .map(ScrambledWord::getWord)
                    .map(String::toLowerCase) // 대소문자 구분 없이 체크
                    .collect(Collectors.toList());

            for (Map<String, String> wordData : wordDataList) {
                String word = wordData.get("word");
                String hint = wordData.get("hint");

                // 입력값 검증
                if (word == null || hint == null || word.isBlank() || hint.isBlank()) {
                    return ResponseEntity.badRequest().body("Invalid word or hint!");
                }

                word = word.trim();
                hint = hint.trim();

                // 중복 체크 (대소문자 구분 없이)
                if (existingWords.contains(word.toLowerCase())) {
                    return ResponseEntity.badRequest().body("단어가 이미 존재합니다: " + word);
                }

                ScrambledWord scrambledWord = new ScrambledWord();
                scrambledWord.setWord(word);
                scrambledWord.setHint(hint);

                scrambledWords.add(scrambledWord);
                existingWords.add(word.toLowerCase()); // 중복 체크에 사용할 단어 추가
            }

            // DB에 단어 저장
            List<ScrambledWord> savedWords = wordRepository.saveAll(scrambledWords);

            // 저장된 단어 목록 반환
            return ResponseEntity.ok(savedWords);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("단어 추가 중 오류가 발생했습니다: " + e.getMessage());
        }
    }



    // 단어 삭제 (word 기준으로)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteWord(@PathVariable Long id) {
        ScrambledWord wordToDelete = wordRepository.findById(id).orElse(null);

        if (wordToDelete != null) {
            wordRepository.delete(wordToDelete);
            return ResponseEntity.ok("단어가 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("단어를 찾을 수 없습니다.");
        }
    }

    @PostMapping("/givepoint")
    public ResponseEntity<?> saveScore(@AuthenticationPrincipal UD user, @RequestBody Map<String, Integer> scoreData) {
    	if (user == null) {
            return ResponseEntity.status(205).build(); // 인증되지 않은 경우
        }
        try {
            User userinfo = userRep.findByEmail(user.getEmail());
            Integer score = scoreData.get("score");
            Integer points = score;
            Integer exp = (score / 2);

            rewardService.InputReward(userinfo, "exp", exp);
            rewardService.InputReward(userinfo, "point", points);
            
//            userinfo.setPoint(points);
//            userinfo.setExp(exp);
//            userRep.save(userinfo);
            
            achieveService.InputAchieveGoal("Scramble", userinfo);
            return ResponseEntity.status(200).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        try {
            List<ScrambledWord> scrambledWords = new ArrayList<>();
            
            // 파일의 스트림을 UTF-8로 처리
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
            
            // 첫 줄(헤더) 건너뛰기
            reader.readLine();
            
            String line;
            List<String> existingWords = wordRepository.findAll().stream()
                    .map(ScrambledWord::getWord)
                    .map(String::toLowerCase) // 대소문자 구분 없이 체크
                    .collect(Collectors.toList());
            
            while ((line = reader.readLine()) != null) {
                // 빈 줄 건너뛰기
                if (line.trim().isEmpty()) {
                    continue;
                }

                // CSV 파일에서 각 단어와 힌트를 추출
                String[] parts = line.split(",");
                if (parts.length >= 2 && parts.length <= 10) {
                    String hint = parts[1].trim(); // 단어 (두 번째 컬럼)
                    String word = parts[0].trim(); // 힌트 (첫 번째 컬럼)

                    // ScrambledWord 객체 생성
                    if (existingWords.contains(word.toLowerCase())) {
                        continue; // 이미 존재하는 단어는 건너뜀
                    }

                    ScrambledWord scrambled = new ScrambledWord();
                    scrambled.setWord(word);
                    scrambled.setHint(hint);
                    scrambledWords.add(scrambled);

                    existingWords.add(word.toLowerCase()); // 중복 체크에 사용할 단어 추가
                }
            }

            // 유효한 단어가 있는 경우에만 저장
            if (!scrambledWords.isEmpty()) {
                // List<ScrambledWord>를 List<Map<String, String>>으로 변환하여 전달
                List<Map<String, String>> wordDataList = scrambledWords.stream()
                    .map(word -> {
                        Map<String, String> map = new HashMap<>();
                        map.put("word", word.getWord());
                        map.put("hint", word.getHint());
                        return map;
                    })
                    .collect(Collectors.toList());

                return addWords(wordDataList);  // List<Map<String, String>>을 전달
            } else {
                return ResponseEntity.badRequest().body("유효한 단어가 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();  // 상세 에러 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("CSV 파일 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }





}
