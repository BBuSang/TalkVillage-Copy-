package Project.Backend.entity;

import java.util.List;
import java.util.Map;

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
@Table(name = "HangmanGameStatus")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "HangmanGameStatusSeq",
	sequenceName = "HangmanGameStatusSeq"
)
@Data
@AllArgsConstructor
@Getter
@Setter
public class HangmanGameStatus {
	@Id
	@GeneratedValue (
			generator = "HangmanGameStatusSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long Id;
	private String displayWord;
    private int remainingAttempts;
    private boolean isGameWon;
    private boolean isGameLost;

    public HangmanGameStatus(String displayWord, int remainingAttempts, boolean isGameWon, boolean isGameLost) {
        this.displayWord = displayWord;
        this.remainingAttempts = remainingAttempts;
        this.isGameWon = isGameWon;
        this.isGameLost = isGameLost;
    }

    public String getDisplayWord() {
        return displayWord;
    }

    public void setDisplayWord(String displayWord) {
        this.displayWord = displayWord;
    }

    public int getRemainingAttempts() {
        return remainingAttempts;
    }

    public void setRemainingAttempts(int remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }

    public boolean isGameWon() {
        return isGameWon;
    }

    public void setGameWon(boolean gameWon) {
        isGameWon = gameWon;
    }

    public boolean isGameLost() {
        return isGameLost;
    }

    public void setGameLost(boolean gameLost) {
        isGameLost = gameLost;
    }
}