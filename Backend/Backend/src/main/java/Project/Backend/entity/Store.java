package Project.Backend.entity;

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
@Table(name = "Store")
@SequenceGenerator(allocationSize = 1, initialValue = 0, name = "ItemSeq", sequenceName = "ItemSeq")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Store {
	@Id
	@GeneratedValue(generator = "ItemSeq", strategy = GenerationType.SEQUENCE)
	Long itemId;
	String itemName;
	String itemCategory;
	Integer price;
	String image;
}
