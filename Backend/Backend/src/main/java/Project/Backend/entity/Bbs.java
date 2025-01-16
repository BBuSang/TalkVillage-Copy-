package Project.Backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
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
@Table(name = "Bbs")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "BoardSeq",
	sequenceName = "BoardSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Bbs {
	@Id
	@GeneratedValue (
			generator = "BoardSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long bbsId;
	@Column(length=200)
	String title;
	@Column(length=3000)
	String content;
	LocalDate registrationDate;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "userId")
	User user;
	
}
