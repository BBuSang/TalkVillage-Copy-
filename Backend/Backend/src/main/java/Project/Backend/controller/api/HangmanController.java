package Project.Backend.controller.api;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.util.ArrayList;
import org.springframework.web.multipart.MultipartFile;

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
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.HangmanGame;
import Project.Backend.entity.HangmanGameStatus;
import Project.Backend.entity.HangmanGameWord;
import Project.Backend.entity.HangmanGuess;
import Project.Backend.entity.User;
import Project.Backend.repository.HangmanGameWordRepository;
import Project.Backend.repository.UserRepository;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/hangman")
@CrossOrigin(origins = "http://localhost:3000")
public class HangmanController {

	@Autowired
	private HangmanGameWordRepository hangmanGameWordRep;

	@Autowired
	UserRepository userRep;

	private String currentWord;
	private String currentCategory; // 카테고리 추가
	private Set<String> usedWords = new HashSet<>(); // 이미 사용된 단어들
	private Set<Character> guessedLetters = new HashSet<>();
	private int remainingAttempts = 6;

	@GetMapping("/start-game")
	public ResponseEntity<Void> StartGame() {
		usedWords.clear();
		return ResponseEntity.ok().build();
	}

	@GetMapping("/new-game")
	public HangmanGame newGame() {
		// 단어 목록을 매번 새로 로드
		List<HangmanGameWord> words = hangmanGameWordRep.findAll();

		// 사용되지 않은 단어들 필터링
		List<HangmanGameWord> unusedWords = words.stream().filter(word -> !usedWords.contains(word.getWord()))
				.collect(Collectors.toList());

		// 랜덤 단어 선택
		if (unusedWords.isEmpty()) {
			usedWords.clear(); // 모든 단어가 사용된 경우 초기화
			unusedWords = words;
		}

		HangmanGameWord selectedWord = unusedWords.get(new Random().nextInt(unusedWords.size()));
		currentWord = selectedWord.getWord();
		currentCategory = selectedWord.getCategory();

		// 단어를 사용된 단어 목록에 추가
		usedWords.add(currentWord);

		// 초기화
		guessedLetters.clear();
		remainingAttempts = 6;

		// 정답 엿보기!
//        System.out.println(currentWord);
		// 단어와 카테고리 정보를 포함한 게임 생성
		return new HangmanGame(currentWord, remainingAttempts, currentCategory);
	}

	@PostMapping("/guess")
	public HangmanGameStatus guessLetter(@RequestBody HangmanGuess guess) {
		char letter = guess.getLetter();
		guessedLetters.add(letter);
		if (!currentWord.contains(String.valueOf(letter))) {
			remainingAttempts--;
		}

		// 단어에 포함된 알파벳을 보여주는 방식
		String displayWord = currentWord.chars()
				.mapToObj(c -> guessedLetters.contains((char) c) ? String.valueOf((char) c) : "_")
				.collect(Collectors.joining(""));

		boolean isGameWon = !displayWord.contains("_"); // 모든 문자를 맞히면 승리
		boolean isGameLost = remainingAttempts <= 0; // 남은 시도가 0이면 실패

		return new HangmanGameStatus(displayWord, remainingAttempts, isGameWon, isGameLost);
	}

	@PostMapping("/addwords")
	public ResponseEntity<?> addWords(@RequestBody List<HangmanGameWord> words) {
	    try {
	        // 입력값 검증
	        if (words == null || words.isEmpty()) {
	            return ResponseEntity.badRequest().body("단어 목록이 비어있습니다.");
	        }

	        // 중복 체크 및 공백 제거
	        List<HangmanGameWord> filteredWords = words.stream()
	                .filter(word -> word.getCategory() != null && !word.getCategory().trim().isEmpty())
	                .filter(word -> word.getWord() != null && !word.getWord().trim().isEmpty())
	                .map(word -> {
	                    word.setCategory(word.getCategory().trim());
	                    word.setWord(word.getWord().trim());
	                    return word;
	                })
	                .distinct()
	                .collect(Collectors.toList());

	        if (filteredWords.isEmpty()) {
	            return ResponseEntity.badRequest().body("유효한 단어가 없습니다.");
	        }

	        // DB에서 중복 체크 (대소문자 구분 없이)
	        List<HangmanGameWord> existingWords = hangmanGameWordRep.findAll();
	        List<HangmanGameWord> newWords = filteredWords.stream()
	                .filter(newWord -> existingWords.stream()
	                        .noneMatch(existing -> 
	                            existing.getWord().equalsIgnoreCase(newWord.getWord())
	                        ))
	                .collect(Collectors.toList());

	        if (newWords.isEmpty()) {
	            return ResponseEntity.badRequest().body("단어가 이미 존재합니다.");
	        }

	        // 저장 및 결과 반환
	        List<HangmanGameWord> savedWords = hangmanGameWordRep.saveAll(newWords);
	        return ResponseEntity.ok(savedWords);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("단어 추가 중 오류가 발생했습니다: " + e.getMessage());
	    }
	}

	@GetMapping("/words")
	public ResponseEntity<?> getAllWords() {
	    try {
	        List<HangmanGameWord> words = hangmanGameWordRep.findAll();
	        return ResponseEntity.ok(words);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("단어 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
	    }
	}

	@DeleteMapping("/words/{id}")
	public ResponseEntity<?> deleteWord(@PathVariable Long id) {
	    try {
	        if (!hangmanGameWordRep.existsById(id)) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body("해당 ID의 단어를 찾을 수 없습니다: " + id);
	        }
	        
	        hangmanGameWordRep.deleteById(id);
	        return ResponseEntity.ok().body("단어가 성공적으로 삭제되었습니다.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("단어 삭제 중 오류가 발생했습니다: " + e.getMessage());
	    }
	}

	@Transactional
	@GetMapping("/givepoint")
	public ResponseEntity<?> GivePointandExp(@AuthenticationPrincipal UD user) {
		if (user == null) {
			return ResponseEntity.status(205).build(); // 인증되지 않은 경우
		}
		try {
			User userinfo = userRep.findByEmail(user.getEmail());
			Integer point = userinfo.getPoint() + 10;
			Integer exp = userinfo.getExp() + 1;
			
			userinfo.setPoint(point);
			userinfo.setExp(exp);
			userRep.save(userinfo);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user data");
		}

		return ResponseEntity.status(200).build();
	}

	@PostMapping("/upload-csv")
	public ResponseEntity<?> uploadCSV(@RequestParam("file") MultipartFile file) {
		try {
			List<HangmanGameWord> words = new ArrayList<>();
			BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
			
			// 다양한 인코딩 시도
			String[] encodings = {"UTF-8", "EUC-KR", "CP949"};
			String content = null;
			
			for (String encoding : encodings) {
				try {
					content = new String(file.getBytes(), encoding);
					// 한글이 포함되어 있는지 테스트
					if (content.matches(".*[가-힣]+.*")) {
						break;  // 한글이 정상적으로 읽히면 중단
					}
				} catch (Exception e) {
					continue;  // 실패시 다음 인코딩 시도
				}
			}
			
			if (content == null) {
				return ResponseEntity.badRequest().body("파일 인코딩을 확인할 수 없습니다.");
			}
						
			// 첫 줄(헤더) 건너뛰기
			reader.readLine();
			
			String line;
			while ((line = reader.readLine()) != null) {
				// 빈 줄 건너뛰기
				if (line.trim().isEmpty()) {
					continue;
				}
				
				String[] parts = line.split(",");
				if (parts.length == 2) {
					HangmanGameWord word = new HangmanGameWord();
					word.setCategory(parts[0].trim());
					word.setWord(parts[1].trim());
					// 디버그용 로그
//					System.out.println("카테고리: " + word.getCategory() + ", 단어: " + word.getWord());
					words.add(word);
				}
			}
			
			return addWords(words);
			
		} catch (Exception e) {
			e.printStackTrace();  // 상세 에러 로그
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("CSV 파일 처리 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

}
