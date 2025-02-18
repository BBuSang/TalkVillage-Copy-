package Project.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "HangmanGuess")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "HangmanGuessSeq",
	sequenceName = "HangmanGuessSeq"
)
@Data
@AllArgsConstructor
@Getter
@Setter
public class HangmanGuess {
	@Id
	@GeneratedValue (
			generator = "HangmanGuessSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long Id;
	 private char letter;

	    public HangmanGuess() {
	    }

	    public HangmanGuess(char letter) {
	        this.letter = letter;
	    }

	    public char getLetter() {
	        return letter;
	    }

	    public void setLetter(char letter) {
	        this.letter = letter;
	    }
	
}
