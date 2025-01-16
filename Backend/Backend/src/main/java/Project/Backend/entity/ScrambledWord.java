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
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ScrambledWord")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "ScrambledWordSeq",
	sequenceName = "ScrambledWordSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScrambledWord {
	@Id
	@GeneratedValue (
			generator = "ScrambledWordSeq",
			strategy = GenerationType.SEQUENCE
			)
	long id;
	private String word;
    private String scrambled;
    private String hint;

    // Constructor, getters, setters
    public ScrambledWord(String word, String hint) {
        this.word = word;
        this.hint = hint;
    }

    public ScrambledWord(String scrambled, String word, String hint) {
        this.scrambled = scrambled;
        this.word = word;
        this.hint = hint;
    }
}
