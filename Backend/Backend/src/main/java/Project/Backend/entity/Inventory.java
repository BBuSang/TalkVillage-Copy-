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
@Table(name = "Inventory")
@SequenceGenerator(allocationSize = 1, initialValue = 0, name = "InventorySeq", sequenceName = "InventorySeq")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Inventory {
	@Id
	@GeneratedValue(generator = "InventorySeq", strategy = GenerationType.SEQUENCE)
 	Long inventoryId;
 	Boolean state;

 	@ManyToOne (fetch = FetchType.EAGER)
 	@JoinColumn (name = "userId")
 	User user;

 	@ManyToOne (fetch = FetchType.EAGER)
 	@JoinColumn (name = "itemId")
 	Store store;

 }
