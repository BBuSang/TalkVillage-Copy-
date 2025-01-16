package Project.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "MyAchievements")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "MyAchievementSeq",
	sequenceName = "MyAchievementSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MyAchievements {
	@Id
	@GeneratedValue (
			generator = "MyAchievementSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long myAchievementId;
	@ManyToOne (fetch = FetchType.EAGER)
	@JoinColumn(name = "achievementId")
	AchievementsList achievementsList;
	
	Integer progress;
}
