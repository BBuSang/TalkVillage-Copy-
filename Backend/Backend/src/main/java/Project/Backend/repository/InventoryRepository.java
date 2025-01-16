package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Inventory;
import Project.Backend.entity.Store;
import Project.Backend.entity.User;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
	List<Inventory> findByUserAndState(User user, Boolean state);

	List<Inventory> findByUser(User user);

	List<Inventory> findByState(Boolean state);

	Inventory findByUserAndStore(User user, Store store);
	
	@Query("SELECT i FROM Inventory i WHERE i.user.userId = :userId AND i.store.itemCategory LIKE CONCAT(:category, '%')")
	List<Inventory> findByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category);

	List<Inventory> findByUserAndStateTrue(User user);

}
