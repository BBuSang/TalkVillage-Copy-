package Project.Backend.controller.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.Inventory;
import Project.Backend.entity.MyStage;
import Project.Backend.entity.User;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.MyStageRepository;
import Project.Backend.repository.StoreRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.UDS;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class StageUserProfileController {

	@Autowired
	UserRepository UserRep;

	@Autowired
	MyStageRepository MyStageRep;

	@Autowired
	InventoryRepository inventoryRep;

	@Autowired
	StoreRepository storeRep;
	
	@Autowired
	UDS uds;

	@GetMapping("/getUserInfo")
	public ResponseEntity<List<String>> GetUserInfo(@AuthenticationPrincipal UD user, String Difficulty) {
		if (user == null) {
            return ResponseEntity.status(250).body(null); // 인증되지 않은 경우
        }
		User userInfo = user.getUser();

		String userNickName = userInfo.getName();
		String userDifficulty = null;
		String userSkinImage = null;
		List<String> userInfoList = new ArrayList<String>();
		
		MyStage MyStage = MyStageRep.findByuser(userInfo);
		if(MyStage != null) {
			if ("easy".equals(Difficulty)) {
				userDifficulty = MyStage.getEasy();
			} else if ("normal".equals(Difficulty)) {
				userDifficulty = MyStage.getNormal();
			} else if ("hard".equals(Difficulty)) {
				userDifficulty = MyStage.getHard();
			} else {
				return null;
			}
		}else {
			
		}
		try {
			List<Inventory> inventories = new ArrayList<Inventory>();
			inventories = inventoryRep.findByUser(userInfo);
			for (Inventory inventory : inventories) {
				if(inventory.getStore().getItemCategory().contains("skin")) {
					userSkinImage = inventory.getStore().getImage();
				}
			}
		} catch (Exception e) {
			System.out.println(e);
		}
				
		userInfoList.add(userNickName);
		userInfoList.add(userDifficulty);
		userInfoList.add(userSkinImage);
		
//		System.out.println(userInfoList);
		
	    return ResponseEntity.status(200).body(userInfoList);
		
	}
}
