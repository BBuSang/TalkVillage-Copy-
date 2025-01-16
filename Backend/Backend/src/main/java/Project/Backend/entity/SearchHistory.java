package Project.Backend.entity;

import java.time.LocalDate;

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
@Table(name = "SearchHistory")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "SearchHistorySeq",
	sequenceName = "SearchHistorySeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SearchHistory {
	@Id
	@GeneratedValue (
			generator = "SearchHistorySeq",
			strategy = GenerationType.SEQUENCE
			)
	Long searchHistoryId;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "userId")
	User user;
	
	String searchWord;
	LocalDate searchDate;
	
	
}
