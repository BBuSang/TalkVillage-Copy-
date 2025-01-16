package Project.Backend.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CrossWordGameWord")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "CrossWordGameWordSeq",
	sequenceName = "CrossWordGameWordSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CrossWordGameWord {
	@Id
	@GeneratedValue (
			generator = "CrossWordGameWordSeq",
			strategy = GenerationType.SEQUENCE
			)
    private Long id;
    private String word;
    private String description;

    @OneToMany(mappedBy = "word", cascade = CascadeType.ALL)
    private List<CrossWordGameWordPosition> positions;

	
}
