package Project.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exam")
@SequenceGenerator(
    name = "exam_seq",
    sequenceName = "exam_seq",
    initialValue = 1,
    allocationSize = 1
)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Exam {
    
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "exam_seq"
    )
    private Long examId;
    
    private String examType;
    private String examQuestion;
    private String passage;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String correctAnswer;
    private String sheetName;
}