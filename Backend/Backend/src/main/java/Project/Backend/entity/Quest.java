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
@Table(name = "Quest")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "QuestSeq",
	sequenceName = "QuestSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Quest {
	@Id
	@GeneratedValue (
			generator = "QuestSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long questId;
	String content;
	Integer goal;
	Integer exp;
	Integer point;
	
}
