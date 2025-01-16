package Project.Backend.controller.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.Inventory;
import Project.Backend.entity.MyStage;
import Project.Backend.entity.Store;
import Project.Backend.entity.User;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.MyStageRepository;
import Project.Backend.repository.StoreRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.UDS;
import jakarta.persistence.EntityManager; 


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UDS userService; // 사용자 정보를 가져오는 서비스 클래스
    
    @Autowired
    UserRepository userRep;
    
    @Autowired
    InventoryRepository inventoryRep;
    
    @Autowired
    StoreRepository storeRep;
    
    @Autowired
    MyStageRepository myStageRep;
    
    @Autowired
    private EntityManager entityManager;
    
    // 현재 로그인한 유저의 모든 정보를 불러옴
    @GetMapping("/user") 
    public ResponseEntity<User> getUserInfo(@AuthenticationPrincipal UD user) {
        if (user == null) {
            return ResponseEntity.status(401).body(null); // 인증되지 않은 경우
        }
        User userInfo = userService.findByEmail(user.getEmail()); // 이메일로 사용자 정보 가져오기
        return ResponseEntity.ok(userInfo); // 사용자 정보 반환
    }
    
    // 현재 로그인한 유저의 닉네임만 불러옴
    @GetMapping("/nickname")
    public ResponseEntity<String> getNickName(@AuthenticationPrincipal UD user) {
    	if (user == null) {
            return ResponseEntity.status(401).body(null); // 인증되지 않은 경우
        }
        User userInfo = userService.findByEmail(user.getEmail()); // 이메일로 사용자 정보 가져오기
    	String nickname = userInfo.getName();
        return ResponseEntity.ok(nickname);
    }
    // 현재 로그인한 유저의 권한을 불러옴
    @GetMapping("/admin")
    public ResponseEntity<String> getAdmin(@AuthenticationPrincipal UD user) {
        if (user == null) {
        	return ResponseEntity.status(401).body(null);
        }
        User userInfo = userService.findByEmail(user.getEmail());
        String Auth = userInfo.getRole();
    	
        System.out.println(userInfo.getName() + "이(가) 접속했습니다 ( " + userInfo.getEmail() + " )" + " 권한 : " + userInfo.getRole());
        
    	return ResponseEntity.ok(Auth);
    }
    
    // 유저 검색 후 유저 정보들을 리스트에 담아서 반환
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String name,
                                                  @RequestParam(required = false) String email) {
        List<User> users = userService.searchUsers(name, email);
        return ResponseEntity.ok(users);
    }
    
    // 수정된 유저 정보를 저장
    @PutMapping("/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        try {
            // 유저 정보를 업데이트하고 결과 반환
            User user = userService.updateUser(userId, updatedUser);
            if (user == null) {
                return ResponseEntity.notFound().build(); // 유저를 찾을 수 없는 경우
            }
            return ResponseEntity.ok(user); // 성공적으로 업데이트된 유저 반환
        } catch (Exception e) {
            // 오류 발생 시 500 상태 코드 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // 검색된 유저의 인벤토리 정보
    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getUserInventory(@RequestParam Long userId) {
    	User user = userRep.findById(userId).orElseThrow();
    	List<Inventory> inventory = inventoryRep.findByUser(user);
    	if(inventory == null) {
    		return ResponseEntity.status(201).build();
    	}
    	
        return ResponseEntity.ok(inventory);
    }
    
    // 인벤토리 삭제
    @DeleteMapping("/inventory")
    public ResponseEntity<?> deleteInventoryItem(@RequestParam Long inventoryId) {
        try {
            inventoryRep.deleteById(inventoryId);
            return ResponseEntity.ok().build(); // 성공 시 HTTP 200 반환
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventory item not found."); // 아이템이 없는 경우
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete inventory item."); // 기타 에러
        }
    }
    
    // 유저에게 아이템 추가
    @PostMapping("/inventory/give")
    public ResponseEntity<?> InsertItem(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long itemId = request.get("itemId");
            
            User user = userRep.findById(userId).orElseThrow();
            Store store = storeRep.findByItemId(itemId);
            
            // 중복 체크
            Inventory existingInventory = inventoryRep.findByUserAndStore(user, store);
            if (existingInventory != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                   .body("이미 보유한 아이템입니다.");
            }
            
            // 중복이 아닌 경우에만 저장
            Inventory inventory = new Inventory();
            inventory.setState(false);
            inventory.setUser(user);
            inventory.setStore(store);
            inventoryRep.save(inventory);
            
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("아이템 지급 중 오류가 발생했습니다.");
        }
    }
    
    
    // 아이템 사용 on/off
    @PutMapping("/inventory/state")
    @Transactional
    public ResponseEntity<?> updateItemState(@RequestBody Map<String, Object> request) {
        try {
            Long inventoryId = Long.parseLong(request.get("inventoryId").toString());
            Long userId = Long.parseLong(request.get("userId").toString());
            String category = request.get("category").toString();
            
            // 1. 먼저 같은 카테고리의 모든 아이템 상태를 false로 변경
            List<Inventory> userItems = inventoryRep.findByUserIdAndCategory(userId,category);
            for (Inventory item : userItems) {
                if (item.getStore().getItemCategory().contains(category)) {
                    item.setState(false);
                    inventoryRep.saveAndFlush(item);  // 즉시 DB에 반영
                }
            }
            
            // 2. 선택한 아이템 상태를 true로 변경
            Inventory inventory = inventoryRep.findById(inventoryId).orElseThrow();
            inventory.setState(true);
            inventoryRep.saveAndFlush(inventory);  // 즉시 DB에 반영
            
            // 3. 영속성 컨텍스트 초기화
            entityManager.clear();
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/userstage")
    public ResponseEntity<MyStage> GetUserStage(@RequestParam Long userId) {
    	User user = userRep.findById(userId).orElseThrow();
    	MyStage myStage = myStageRep.findByuser(user);
    	if(myStage == null) {
    		return ResponseEntity.status(201).build();
    	}
        return ResponseEntity.ok(myStage);
    }
    
    @PutMapping("/userstage/update")
    public ResponseEntity<?> UpdateUserStage(@RequestBody Map<String, String> request) {
        try {
            Long userId = Long.parseLong(request.get("userId"));
            User user = userRep.findById(userId).orElseThrow();
            
            MyStage myStage = myStageRep.findByuser(user);
            if(myStage == null) {
                myStage = new MyStage();
                myStage.setUser(user);
            }
            
            // 각 난이도별 업데이트
            if(request.containsKey("easy")) {
                myStage.setEasy(request.get("easy"));
            }
            if(request.containsKey("normal")) {
                myStage.setNormal(request.get("normal"));
            }
            if(request.containsKey("hard")) {
                myStage.setHard(request.get("hard"));
            }
            
            myStageRep.save(myStage);
            return ResponseEntity.ok(myStage);
            
        } catch (Exception e) {
            e.printStackTrace(); // 로그 확인을 위해 추가
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/useingprofile")
    @Transactional(readOnly = true)
    public ResponseEntity<List<String>> usingItem(@AuthenticationPrincipal UD user) {
        // 영속성 컨텍스트 초기화로 최신 데이터 조회
        entityManager.clear();
        
        List<Inventory> userInven = inventoryRep.findByUserAndStateTrue(user.getUser());
        List<String> usingItem = new ArrayList<>();
        usingItem.add(user.getName());
        
        for (Inventory inventory : userInven) {
            if (inventory.getStore() != null) {
                String itemCategory = inventory.getStore().getItemCategory();
                if (itemCategory != null) {
                    if (itemCategory.contains("Background-") || itemCategory.contains("NamePlate-")) {
                        usingItem.add(itemCategory);
                    }
                }
                String skin = inventory.getStore().getImage();
                if (skin != null) {
                    usingItem.add(skin);
                }
            }
        }
        
        return ResponseEntity.ok(usingItem);
    }

    
    
}






















