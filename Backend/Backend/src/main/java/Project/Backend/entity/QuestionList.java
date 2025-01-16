//package Project.Backend.entity;
//
//import java.util.List;
//import java.util.Map;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.SequenceGenerator;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "QuestionList")
//@SequenceGenerator(
//	allocationSize = 1,
//	initialValue = 0,
//	name = "QuestionSeq",
//	sequenceName = "QuestionSeq"
//)
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//public class QuestionList {
//	@Id
//	@GeneratedValue (
//			generator = "QuestionSeq",
//			strategy = GenerationType.SEQUENCE
//			)
//	Long questionListId;
//	String stageLevel;
//	String question;
//	String result;
//	String type;
//}
package Project.Backend.entity;

import java.util.List;
import java.util.Map;

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
@Table(name = "QuestionList")
@SequenceGenerator(
    allocationSize = 1,
    initialValue = 0,
    name = "QuestionSeq",
    sequenceName = "QuestionSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class QuestionList {
    @Id
    @GeneratedValue (
            generator = "QuestionSeq",
            strategy = GenerationType.SEQUENCE
            )
    Long questionListId;
    String stageLevel;
    String question;
    String result;      // 정답
    String wrongData;   // 오답 (콤마로 구분된 문자열로 저장)
    String type;
}