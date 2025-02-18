package Project.Backend.entity;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "UserTable")
@SequenceGenerator(
	allocationSize = 1,
	initialValue = 0,
	name = "UserSeq",
	sequenceName = "UserSeq"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
	@Id
	@GeneratedValue (
			generator = "UserSeq",
			strategy = GenerationType.SEQUENCE
			)
	Long userId;
	String email; // 이메일
	String pw; // 비밀번호
	String name; // 닉네임
	String provider; //(어디서 최초 로그인 했는지 확인이 필요할거 같음)
	LocalDate birthdate; // 생년월일
	Integer exp; // 경험치
	Integer point; // 게임머니
	Integer grade; // 레벨인데 삭제할거임
	String role; // ROLE_USER, ROLE_ADMIN
	LocalDate firstsignup; // 최초가입일
	LocalDate editinfo; // 정보 수정일
	
	@Transient
	Map<String, Object> attributes = new HashMap<String, Object>();
	
	@OneToMany(mappedBy = "user" , fetch = FetchType.EAGER)
	@JsonIgnore
	List<Inventory> inventory;
	
	@OneToMany(mappedBy = "user" , fetch = FetchType.EAGER)
	@JsonIgnore
	List<MyQuest> myQuest;

	@OneToMany(mappedBy = "user" , fetch = FetchType.EAGER)
	@JsonIgnore
	List<VocabularyList> vocabularyList;
	
}