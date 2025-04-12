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
@Table(name = "AchievementsList")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "AchievementSeq",
	sequenceName = "AchievementSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AchievementsList {
	@Id
	@GeneratedValue (
			generator = "AchievementSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long achievementId;
	String title;
	String content;
	Integer goal;
	Integer exp; // exp라고 되어있지만 사실상 point
	String type;
	String category;
}
