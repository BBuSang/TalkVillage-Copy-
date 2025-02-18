package Project.Backend.controller.api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
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
import Project.Backend.entity.CrossWordGameWord;
import Project.Backend.entity.User;
import Project.Backend.repository.CrossWordGameWordRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.CrossWordGameWordService;

@RestController
@RequestMapping("/api/puzzle")
@CrossOrigin(origins = "http://localhost:3000")
public class CrossWordController {

	@Autowired
	private CrossWordGameWordService wordPuzzleService;

	@Autowired
	CrossWordGameWordRepository crossWordGameWordRep;

	@Autowired
	UserRepository userRep;

	// 퍼즐 생성 API
	@GetMapping("/generate")
	public Map<String, Object> generatePuzzle() {
		return wordPuzzleService.generatePuzzle();
	}

	// 단어 목록 조회
	@GetMapping("/words")
	public ResponseEntity<List<CrossWordGameWord>> getAllWords() {
		return ResponseEntity.ok(crossWordGameWordRep.findAll());
	}

	// 단어 추가
	@PostMapping("/add-word")
	public ResponseEntity<?> addWord(@RequestBody CrossWordGameWord word) {
		try {
			// 영문자 검증
			if (!word.getWord().matches("^[a-zA-Z]+$")) {
				return ResponseEntity.badRequest().body("단어는 영문자만 포함할 수 있습니다.");
			}

			// 소문자로 변환하여 저장
			word.setWord(word.getWord().toLowerCase());
			CrossWordGameWord savedWord = crossWordGameWordRep.save(word);
			return ResponseEntity.ok(savedWord);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// 단어 삭제
	@DeleteMapping("/words/{id}")
	public ResponseEntity<?> deleteWord(@PathVariable Long id) {
		try {
			crossWordGameWordRep.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// CSV 파일 업로드
	@PostMapping("/upload-csv")
	public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
		try {
			List<CrossWordGameWord> CrossWordGameWords = new ArrayList<>();

			// 파일의 스트림을 UTF-8로 처리
			BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));

			// 첫 줄(헤더) 건너뛰기
			reader.readLine();

			String line;
			List<String> existingWords = crossWordGameWordRep.findAll().stream().map(CrossWordGameWord::getWord)
					.map(String::toLowerCase) // 대소문자 구분 없이 체크
					.collect(Collectors.toList());

			while ((line = reader.readLine()) != null) {
				// 빈 줄 건너뛰기
				if (line.trim().isEmpty()) {
					continue;
				}

				// CSV 파일에서 각 단어와 힌트를 추출
				String[] parts = line.split(",");
				if (parts.length >= 2) {
					String word = parts[0].trim();
					String hint = parts[1].trim();

					// 단어의 유효성 검사 (영문자만 허용)
					if (!word.matches("^[a-zA-Z]+$")) {
						continue; // 유효하지 않은 단어는 건너뜀
					}

					// 중복 단어 검사
					if (existingWords.contains(word.toLowerCase())) {
						continue; // 이미 존재하는 단어는 건너뜀
					}

					// ScrambledWord 객체 생성 및 추가
					CrossWordGameWord CrossWordGameWord = new CrossWordGameWord();
					CrossWordGameWord.setWord(word);
					CrossWordGameWord.setDescription(hint);
					CrossWordGameWords.add(CrossWordGameWord);

					// 중복 체크를 위해 단어 추가
					existingWords.add(word.toLowerCase());
				}
			}

			// 유효한 단어가 있는 경우에만 저장
			if (!CrossWordGameWords.isEmpty()) {
				List<CrossWordGameWord> savedWords = crossWordGameWordRep.saveAll(CrossWordGameWords);
				return ResponseEntity.ok(savedWords);
			} else {
				return ResponseEntity.badRequest().body("유효한 단어가 없습니다.");
			}

		} catch (Exception e) {
			e.printStackTrace(); // 상세 에러 로그 출력
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("CSV 파일 처리 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	@Transactional
	@PostMapping("/score")
	public ResponseEntity<?> giveScore(@AuthenticationPrincipal UD user, @RequestBody Integer score) {
	    if (user == null) {
	        return ResponseEntity.status(205).build(); // 인증되지 않은 경우
	    }
	    try {
	        Integer exp = null;
	        Integer point = null;
	        User userinfo = userRep.findByEmail(user.getEmail());
	        if(score <= 60) {
	            exp = userinfo.getExp() + 200;
	            point = userinfo.getPoint() + 10000;
	        } else if(score <= 120) {
	            exp = userinfo.getExp() + 100;
	            point = userinfo.getPoint() + 1000;
	        } else if(score <= 180) {
	            exp = userinfo.getExp() + 50;
	            point = userinfo.getPoint() + 500;
	        } else if(score <= 240) {
	            exp = userinfo.getExp() + 25;
	            point = userinfo.getPoint() + 250;
	        } else {
	            exp = userinfo.getExp() + 10;
	            point = userinfo.getPoint() + 100;
	        }
	        
	        userinfo.setPoint(point);
	        userinfo.setExp(exp);
	        userRep.save(userinfo);    
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user data");
	    }
	    
	    return ResponseEntity.ok().build();
	}

}
