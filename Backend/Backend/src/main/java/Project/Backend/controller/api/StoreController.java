package Project.Backend.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.Inventory;
import Project.Backend.entity.Store;
import Project.Backend.entity.User;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.StoreRepository;
import Project.Backend.repository.UserRepository;


@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "http://localhost:3000")
public class StoreController {

	@Autowired
	StoreRepository storeRep;

	@Autowired 
	UserRepository userRep;

	@Autowired
	InventoryRepository invRep;
	
	@GetMapping("/items")
	public ResponseEntity<List<Store>> GetStoreItems() {
		List<Store> store = storeRep.findAllOrderByItemId();
		
		return ResponseEntity.ok(store);
	}

	@GetMapping("/purchase")
	public ResponseEntity<?> PurchaseItem(@RequestParam Long itemId, @AuthenticationPrincipal UD userinfo) {
		try {
			// 세션에서 현재 로그인한 사용자 정보 가져오기
			User user = new User();
			user = userinfo.getUser();
			
			// 아이템 정보 가져오기
			Store item = storeRep.findByItemId(itemId);

			// 사용자의 포인트가 충분한지 확인
			if (user.getPoint() < item.getPrice()) {
				return ResponseEntity.badRequest().body("Not enough points");
			}

			// 포인트 차감
			user.setPoint(user.getPoint() - item.getPrice());
			userRep.save(user);

			// 인벤토리에 아이템 추가 (state를 false로 설정)
			Inventory inventory = new Inventory();
			inventory.setUser(user);
			inventory.setStore(item);
			inventory.setState(false);
			invRep.save(inventory);

			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
}
