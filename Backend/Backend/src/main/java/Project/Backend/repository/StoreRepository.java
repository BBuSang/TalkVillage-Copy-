package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.Store;


@Repository
public interface StoreRepository extends JpaRepository<Store, Long>{
	public Store findByItemId(Long itemID);
	boolean existsByItemName(String name);
	boolean existsByItemCategory(String itemCategory);
	public Store findByItemCategory(String itemCategory);
	
	// 추가: itemId 기준으로 정렬하여 모든 데이터 조회
	@Query("SELECT s FROM Store s ORDER BY s.itemId")
	List<Store> findAllOrderByItemId();
}
