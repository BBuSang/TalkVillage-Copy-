package Project.Backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "HangmanGame")
@SequenceGenerator(
    allocationSize = 1,
    initialValue = 0,
    name = "HangmanGameSeq",
    sequenceName = "HangmanGameSeq"
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HangmanGame {
    @Id
    @GeneratedValue(
        generator = "HangmanGameSeq",
        strategy = GenerationType.SEQUENCE
    )
    Long Id;

    private String wordToGuess;       // 사용자가 맞춰야 하는 단어
    private Set<Character> guessedLetters; // 사용자가 추측한 글자들
    private int remainingAttempts;    // 남은 시도 횟수
    private String category;  // 카테고리 추가
    private int maxAttempts;          // 최대 시도 횟수
    private boolean isGameWon;        // 게임 승리 여부
    private boolean isGameLost;       // 게임 패배 여부
    private boolean isGameOver;       // 게임 종료 여부

    // 기존 생성자 수정: 카테고리와 단어 초기화
    public HangmanGame(String wordToGuess, int maxAttempts, String category) {
        this.wordToGuess = wordToGuess.toLowerCase();
        this.maxAttempts = maxAttempts;
        this.remainingAttempts = maxAttempts;
        this.category = category;
        this.guessedLetters = new HashSet<>();
        this.isGameWon = false;
        this.isGameLost = false;
        this.isGameOver = false;
    }

    // 사용자가 글자를 추측할 때 호출되는 메서드
    public HangmanGameStatus guessLetter(char letter) {
        letter = Character.toLowerCase(letter);

        if (guessedLetters.contains(letter)) {
            return getCurrentGameStatus();  // 이미 추측한 글자면 게임 상태만 반환
        }

        guessedLetters.add(letter);

        if (!wordToGuess.contains(String.valueOf(letter))) {
            remainingAttempts--;
            if (remainingAttempts <= 0) {
                isGameLost = true;
                isGameOver = true;
            }
        } else if (isWordGuessed()) {
            isGameWon = true;
            isGameOver = true;
        }

        return getCurrentGameStatus();
    }

    // 현재까지 맞춘 단어 상태를 문자열로 반환
    public String getDisplayWord() {
        StringBuilder displayWord = new StringBuilder();
        for (char letter : wordToGuess.toCharArray()) {
            if (guessedLetters.contains(letter)) {
                displayWord.append(letter);
            } else {
                displayWord.append('_');
            }
            displayWord.append(" "); // 각 글자 사이에 공백 추가
        }
        return displayWord.toString().trim(); // 끝의 공백 제거
    }

    // 게임의 현재 상태 반환
    public HangmanGameStatus getCurrentGameStatus() {
        return new HangmanGameStatus(
            getDisplayWord(),
            remainingAttempts,
            isGameWon,
            isGameLost
        );
    }

    // 단어를 모두 맞췄는지 확인
    private boolean isWordGuessed() {
        for (char letter : wordToGuess.toCharArray()) {
            if (!guessedLetters.contains(letter)) {
                return false;
            }
        }
        return true;
    }
}
