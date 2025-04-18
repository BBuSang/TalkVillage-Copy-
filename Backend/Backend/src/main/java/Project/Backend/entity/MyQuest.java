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
@Table(name = "MyQuest")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "MyQuestSeq",
	sequenceName = "MyQuestSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MyQuest {
	@Id
	@GeneratedValue (
			generator = "MyQuestSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long myQuestId;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "userId")
	User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "questId")
	Quest quest;
	
	Integer progress;
	Boolean isRewardClaimed;
	
	
	
}
