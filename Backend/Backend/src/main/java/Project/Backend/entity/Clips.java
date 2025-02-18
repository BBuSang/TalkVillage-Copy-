package Project.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Clips")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "ClipSeq",
	sequenceName = "ClipSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Clips {
    @Id
	@GeneratedValue (
			generator = "ClipSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long clipId;
    String clipUrl;
	Integer startTime;
	Integer endTime;
    @ManyToOne
	Sentences sentence;
}
