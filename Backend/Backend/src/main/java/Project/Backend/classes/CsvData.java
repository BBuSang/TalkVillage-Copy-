package Project.Backend.classes;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//@Data
//public class CsvData {
//    private String stageLevel;
//    private String question;
//    private String result;
//    private String wrongData;
//    private String type;
//}
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CsvData {
    // Exam 필드
    private String examId;
    private String type;
    private String question;
    private String passage;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String correctAnswer;
    
    // TalkVillage 필드
    private String stageLevel;
    private String result;
    private String wrongData;
}