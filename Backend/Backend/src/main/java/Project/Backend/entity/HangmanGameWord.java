package Project.Backend.entity;


import java.util.Objects;

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
@Table(name = "HangmanGameWord")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "HangmanGameWordSeq",
	sequenceName = "HangmanGameWordSeq"
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HangmanGameWord {
    @Id
    @GeneratedValue(
        generator = "HangmanGameWordSeq",
        strategy = GenerationType.SEQUENCE
    )
    Long Id;
    String Word;
    String category;
    
 // equals & hashCode 구현 (카테고리와 단어 기준으로 중복 제거)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HangmanGameWord word1 = (HangmanGameWord) o;
        return category.equalsIgnoreCase(word1.category) && Word.equalsIgnoreCase(word1.Word);
    }

    @Override
    public int hashCode() {
        return Objects.hash(category.toLowerCase(), Word.toLowerCase());
    }
}
