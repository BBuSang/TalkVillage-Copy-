package Project.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import lombok.ToString;

@Entity
@Table(name = "VocabularyList")
@SequenceGenerator(
    name = "VocabularyListSeq",
    sequenceName = "VocabularyListSeq",
    allocationSize = 1,
    initialValue = 1  // 0에서 1로 변경
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = "user")
public class VocabularyList {
    
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "VocabularyListSeq"
    )
    @Column(name = "vocabulary_list_id")
    private Long vocabularyListId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(name = "worden", nullable = false)
    private String wordEN;
    
    @Column(name = "wordko", nullable = false)
    private String wordKO;
    
    @Column(name = "bookmark_state", nullable = false)
    private Boolean bookmarkState = false;  // 기본값 설정
    
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }
}