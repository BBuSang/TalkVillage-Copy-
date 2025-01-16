package Project.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Store;
import Project.Backend.entity.User;
import java.util.List;


@Repository
public interface StoreRepository extends JpaRepository<Store, Long>{
	public Store findByItemId(Long itemID);
	boolean existsByItemName(String name);
	boolean existsByItemCategory(String itemCategory);
	public Store findByItemCategory(String itemCategory);
}
