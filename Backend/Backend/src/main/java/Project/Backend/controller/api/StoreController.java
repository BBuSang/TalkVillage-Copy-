package Project.Backend.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.entity.Store;
import Project.Backend.repository.StoreRepository;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "http://localhost:3000")
public class StoreController {

	@Autowired
	StoreRepository storeRep;
	
	@GetMapping("/items")
	public ResponseEntity<List<Store>> GetStoreItems() {
		List<Store> store = storeRep.findAll();
		
		return ResponseEntity.ok(store);
	}
	
}
