
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
@Table(name = "Sentences")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "SentenceSeq",
	sequenceName = "SentenceSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Sentences {
    @Id
	@GeneratedValue (
			generator = "SentenceSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long sentenceId;
    String sentence;
}
