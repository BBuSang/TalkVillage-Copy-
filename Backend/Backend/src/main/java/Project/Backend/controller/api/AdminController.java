package Project.Backend.controller.api;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.Store;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.MyStageRepository;
import Project.Backend.repository.StoreRepository;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
	
	@Autowired
	MyStageRepository MyStageRep;
	
	@Autowired
	StoreRepository storeRep;
	
	@Autowired
	InventoryRepository inventoryRep;
	
	@GetMapping("/basicskin")
	public ResponseEntity<Void> basicskinplus(@AuthenticationPrincipal UD user) {
	    
//	    // 기존 데이터 확인
//	    if (MyStageRep.existsByUser(user.getUser())) {
//	        return ResponseEntity.badRequest().build(); // 이미 데이터가 존재함
//	    }
//
//	    MyStage x = new MyStage();
//	    x.setUser(user.getUser());
//	    x.setEasy("2-3");
//	    x.setNormal("1-3");
//	    x.setHard("3-1");
//	    MyStageRep.save(x);
		
		// 상점에 기본 skin 4 종류 추가
		if(storeRep.existsByItemCategory("skin-100")) {
			return ResponseEntity.badRequest().build(); // 이미 데이터가 존재함
		}
	    Store skin1 = new Store();
	    skin1.setItemCategory("skin-100");
	    skin1.setItemName("배찌");
	    skin1.setPrice(100);
	    skin1.setImage("./basicSkin/skin1.png");
	    storeRep.save(skin1);
	    
	    Store skin2 = new Store();
	    skin2.setItemCategory("skin-200");
	    skin2.setItemName("다오");
	    skin2.setPrice(100);
	    skin2.setImage("./basicSkin/skin2.png");
	    storeRep.save(skin2);
	    
	    Store skin3 = new Store();
	    skin3.setItemCategory("skin-300");
	    skin3.setItemName("디지니");
	    skin3.setPrice(100);
	    skin3.setImage("./basicSkin/skin3.png");
	    storeRep.save(skin3);
	    
	    Store skin4 = new Store();
	    skin4.setItemCategory("skin-400");
	    skin4.setItemName("우니");
	    skin4.setPrice(100);
	    skin4.setImage("./basicSkin/skin4.png");
	    storeRep.save(skin4);
	    
	    // 럭셔리 스킨
	    Store skin101 = new Store();
	    skin101.setItemCategory("skin-101");
	    skin101.setItemName("럭셔리 배찌");
	    skin101.setPrice(1000);
	    skin101.setImage("./cha_skins/skin-101.png");
	    storeRep.save(skin101);
	    
	    Store skin201 = new Store();
	    skin201.setItemCategory("skin-201");
	    skin201.setItemName("럭셔리 다오");
	    skin201.setPrice(1000);
	    skin201.setImage("./cha_skins/skin-201.png");
	    storeRep.save(skin201);
	    
	    Store skin301 = new Store();
	    skin301.setItemCategory("skin-301");
	    skin301.setItemName("럭셔리 디지니");
	    skin301.setPrice(1000);
	    skin301.setImage("./cha_skins/skin-301.png");
	    storeRep.save(skin301);
	    
	    Store skin401 = new Store();
	    skin401.setItemCategory("skin-401");
	    skin401.setItemName("럭셔리 우니");
	    skin401.setPrice(1000);
	    skin401.setImage("./cha_skins/skin-401.png");
	    storeRep.save(skin401);

	    
	    return ResponseEntity.ok(null);
	}
	@GetMapping("/BackandName")
	public ResponseEntity<Void> basicBGandNamePlateplus() {
		
		if(storeRep.existsByItemCategory("Background-0")) {
			return ResponseEntity.badRequest().build(); // 이미 데이터가 존재함
		}
		// 배경 아이템 생성
		Store Background0 = new Store();
		Background0.setItemCategory("Background-0");
		Background0.setItemName("기본 배경");
		Background0.setPrice(0);
		storeRep.save(Background0);

		Store Background1 = new Store();
		Background1.setItemCategory("Background-1");
		Background1.setItemName("푸른 하늘 배경");
		Background1.setPrice(200000);
		storeRep.save(Background1);

		Store Background2 = new Store();
		Background2.setItemCategory("Background-2");
		Background2.setItemName("우주 배경");
		Background2.setPrice(300000);
		storeRep.save(Background2);
		
		Store Background3 = new Store();
		Background3.setItemCategory("Background-3");
		Background3.setItemName("밤하늘 배경");
		Background3.setPrice(300000);
		storeRep.save(Background3);
		
		Store Background4 = new Store();
		Background4.setItemCategory("Background-4");
		Background4.setItemName("황금빛 배경");
		Background4.setPrice(500000);
		storeRep.save(Background4);

		Store Background5 = new Store();
		Background5.setItemCategory("Background-5");
		Background5.setItemName("크리스탈 배경");
		Background5.setPrice(500000);
		storeRep.save(Background5);
		
		Store Background6 = new Store();
		Background6.setItemCategory("Background-6");
		Background6.setItemName("얼불 배경");
		Background6.setPrice(1000000);
		storeRep.save(Background6);

		// 이름표 아이템 생성
		Store NamePlate0 = new Store();
		NamePlate0.setItemCategory("NamePlate-0");
		NamePlate0.setItemName("기본 이름표");
		NamePlate0.setPrice(0);
		storeRep.save(NamePlate0);

		Store NamePlate1 = new Store();
		NamePlate1.setItemCategory("NamePlate-1");
		NamePlate1.setItemName("황금빛 이름표");
		NamePlate1.setPrice(200000);
		storeRep.save(NamePlate1);

		Store NamePlate2 = new Store();
		NamePlate2.setItemCategory("NamePlate-2");
		NamePlate2.setItemName("크리스탈 이름표");
		NamePlate2.setPrice(300000);
		storeRep.save(NamePlate2);
		
		Store NamePlate3 = new Store();
		NamePlate3.setItemCategory("NamePlate-3");
		NamePlate3.setItemName("우주 이름표");
		NamePlate3.setPrice(300000);
		storeRep.save(NamePlate3);

		Store NamePlate4 = new Store();
		NamePlate4.setItemCategory("NamePlate-4");
		NamePlate4.setItemName("푸른 하늘 이름표");
		NamePlate4.setPrice(300000);
		storeRep.save(NamePlate4);

		Store NamePlate5 = new Store();
		NamePlate5.setItemCategory("NamePlate-5");
		NamePlate5.setItemName("밤하늘 이름표");
		NamePlate5.setPrice(300000);
		storeRep.save(NamePlate5);
	    
	    return ResponseEntity.ok(null);
	}
	
}
