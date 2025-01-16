package Project.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CrossWordGameWordPosition")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "CrossWordGameWordPositionSeq",
	sequenceName = "CrossWordGameWordPositionSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CrossWordGameWordPosition {
	 @Id
	 @GeneratedValue (
				generator = "CrossWordGameWordPositionSeqSeq",
				strategy = GenerationType.SEQUENCE
				)
	    private Long id;

	    @ManyToOne
	    @JoinColumn(name = "word_id")
	    private CrossWordGameWord word;

	    private int startRow;
	    private int startCol;
	    private String direction;


	
}
