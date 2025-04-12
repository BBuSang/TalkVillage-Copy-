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
import Project.Backend.entity.AchievementsList;
import Project.Backend.entity.Store;
import Project.Backend.entity.Quest;
import Project.Backend.repository.AchievementsListRepository;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.MyStageRepository;
import Project.Backend.repository.StoreRepository;
import Project.Backend.repository.QuestRepository;


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
	
	@Autowired
	AchievementsListRepository achievementsListRep;
	
	@Autowired
	QuestRepository questRep;
	
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
	
	@GetMapping("/achieve")
	public ResponseEntity<Void> achieceAdmin() {
		if(achievementsListRep.existsByContent("모든 게임 모드 1회 이상 플레이")) {
			return ResponseEntity.badRequest().build();
		}
		
		// 학습 관련 업적
//		AchievementsList achievementsList1 = new AchievementsList();
//		achievementsList1.setContent("학습 10회 완료");
//		achievementsList1.setExp(10);
//		achievementsList1.setGoal(10);
//		achievementsList1.setTitle("공부 시작");
//		achievementsList1.setType("study");
//		achievementsList1.setCategory("학습");
//		achievementsListRep.save(achievementsList1);

		// 게임 관련 업적
		AchievementsList achievementsList2 = new AchievementsList();
		achievementsList2.setContent("모든 게임 모드 1회 이상 플레이");
		achievementsList2.setExp(30);
		achievementsList2.setGoal(3);
		achievementsList2.setTitle("게임 마스터");
		achievementsList2.setType("game");
		achievementsList2.setCategory("게임");
		achievementsListRep.save(achievementsList2);
		
		// 행맨 1회 완료
		AchievementsList achievementsList2_1 = new AchievementsList();
		achievementsList2_1.setContent("HangMan 1회 플레이");
		achievementsList2_1.setExp(30);
		achievementsList2_1.setGoal(1);
		achievementsList2_1.setTitle("행맨 마스터");
		achievementsList2_1.setType("hangman");
		achievementsList2_1.setCategory("게임");
		achievementsListRep.save(achievementsList2_1);
		
		// 스크램들워드 1회 완료
		AchievementsList achievementsList2_2 = new AchievementsList();
		achievementsList2_2.setContent("Scramble Word 1회 플레이");
		achievementsList2_2.setExp(30);
		achievementsList2_2.setGoal(1);
		achievementsList2_2.setTitle("스크럼블 마스터");
		achievementsList2_2.setType("Scramble");
		achievementsList2_2.setCategory("게임");
		achievementsListRep.save(achievementsList2_2);
		
		// 크로스워드 1회 완료
		AchievementsList achievementsList2_3 = new AchievementsList();
		achievementsList2_3.setContent("Cross Word 1회 플레이");
		achievementsList2_3.setExp(30);
		achievementsList2_3.setGoal(1);
		achievementsList2_3.setTitle("십자말풀이 마스터");
		achievementsList2_3.setType("Cross Word");
		achievementsList2_3.setCategory("게임");
		achievementsListRep.save(achievementsList2_3);
		
		// 4. crossword 클리어
		AchievementsList achievementsList4 = new AchievementsList();
		achievementsList4.setContent("크로스워드를 60초 안에 클리어");
		achievementsList4.setExp(50);
		achievementsList4.setGoal(60);
		achievementsList4.setTitle("크로스워드 달인");
		achievementsList4.setType("crossword60");
		achievementsList4.setCategory("게임");
		achievementsListRep.save(achievementsList4);
		
		
		// 레벨 관련 업적
		AchievementsList achievementsList6 = new AchievementsList();
		achievementsList6.setContent("레벨 10 달성하기");
		achievementsList6.setExp(100);
		achievementsList6.setGoal(10);
		achievementsList6.setTitle("성장하는 학습자");
		achievementsList6.setType("level");
		achievementsList6.setCategory("레벨");
		achievementsListRep.save(achievementsList6);
		
		AchievementsList achievementsList6_20 = new AchievementsList();
		achievementsList6_20.setContent("레벨 20 달성하기");
		achievementsList6_20.setExp(200);
		achievementsList6_20.setGoal(20);
		achievementsList6_20.setTitle("열심히 하는 학습자");
		achievementsList6_20.setType("level");
		achievementsList6_20.setCategory("레벨");
		achievementsListRep.save(achievementsList6_20);
		
		AchievementsList achievementsList6_30 = new AchievementsList();
		achievementsList6_30.setContent("레벨 30 달성하기");
		achievementsList6_30.setExp(300);
		achievementsList6_30.setGoal(30);
		achievementsList6_30.setTitle("노력하는 학습자");
		achievementsList6_30.setType("level");
		achievementsList6_30.setCategory("레벨");
		achievementsListRep.save(achievementsList6_30);
		
		AchievementsList achievementsList6_40 = new AchievementsList();
		achievementsList6_40.setContent("레벨 40 달성하기");
		achievementsList6_40.setExp(400);
		achievementsList6_40.setGoal(40);
		achievementsList6_40.setTitle("실력있는 학습자");
		achievementsList6_40.setType("level");
		achievementsList6_40.setCategory("레벨");
		achievementsListRep.save(achievementsList6_40);
		
		AchievementsList achievementsList6_50 = new AchievementsList();
		achievementsList6_50.setContent("레벨 50 달성하기");
		achievementsList6_50.setExp(500);
		achievementsList6_50.setGoal(50);
		achievementsList6_50.setTitle("뛰어난 학습자");
		achievementsList6_50.setType("level");
		achievementsList6_50.setCategory("레벨");
		achievementsListRep.save(achievementsList6_50);
		
		AchievementsList achievementsList6_60 = new AchievementsList();
		achievementsList6_60.setContent("레벨 60 달성하기");
		achievementsList6_60.setExp(600);
		achievementsList6_60.setGoal(60);
		achievementsList6_60.setTitle("우수한 학습자");
		achievementsList6_60.setType("level");
		achievementsList6_60.setCategory("레벨");
		achievementsListRep.save(achievementsList6_60);
		
		AchievementsList achievementsList6_70 = new AchievementsList();
		achievementsList6_70.setContent("레벨 70 달성하기");
		achievementsList6_70.setExp(700);
		achievementsList6_70.setGoal(70);
		achievementsList6_70.setTitle("탁월한 학습자");
		achievementsList6_70.setType("level");
		achievementsList6_70.setCategory("레벨");
		achievementsListRep.save(achievementsList6_70);
		
		AchievementsList achievementsList6_80 = new AchievementsList();
		achievementsList6_80.setContent("레벨 80 달성하기");
		achievementsList6_80.setExp(800);
		achievementsList6_80.setGoal(80);
		achievementsList6_80.setTitle("대단한 학습자");
		achievementsList6_80.setType("level");
		achievementsList6_80.setCategory("레벨");
		achievementsListRep.save(achievementsList6_80);
		
		AchievementsList achievementsList6_90 = new AchievementsList();
		achievementsList6_90.setContent("레벨 90 달성하기");
		achievementsList6_90.setExp(900);
		achievementsList6_90.setGoal(90);
		achievementsList6_90.setTitle("최고의 학습자");
		achievementsList6_90.setType("level");
		achievementsList6_90.setCategory("레벨");
		achievementsListRep.save(achievementsList6_90);
		
		AchievementsList achievementsList6_100 = new AchievementsList();
		achievementsList6_100.setContent("레벨 100 달성하기");
		achievementsList6_100.setExp(1000);
		achievementsList6_100.setGoal(100);
		achievementsList6_100.setTitle("전설적인 학습자");
		achievementsList6_100.setType("level");
		achievementsList6_100.setCategory("레벨");
		achievementsListRep.save(achievementsList6_100);
		
		// 수집/보상 관련 업적
		AchievementsList achievementsList7 = new AchievementsList();
		achievementsList7.setContent("100,000 포인트 모으기");
		achievementsList7.setExp(50);
		achievementsList7.setGoal(100000);
		achievementsList7.setTitle("포인트 부자");
		achievementsList7.setType("point");
		achievementsList7.setCategory("수집");
		achievementsListRep.save(achievementsList7);
		
		// 8. 상점 아이템
		AchievementsList achievementsList8 = new AchievementsList();
		achievementsList8.setContent("상점 아이템 5개 구매하기");
		achievementsList8.setExp(40);
		achievementsList8.setGoal(5);
		achievementsList8.setTitle("수집가");
		achievementsList8.setType("item");
		achievementsList8.setCategory("수집");
		achievementsListRep.save(achievementsList8);
		
		// 출석 관련 업적
		AchievementsList achievementsList9 = new AchievementsList();
		achievementsList9.setContent("7일 연속 출석하기");
		achievementsList9.setExp(70);
		achievementsList9.setGoal(7);
		achievementsList9.setTitle("꾸준함의 첫 증표");
		achievementsList9.setType("attendance");
		achievementsList9.setCategory("출석");
		achievementsListRep.save(achievementsList9);
		
		// 출석 관련 업적
		AchievementsList achievementsList10 = new AchievementsList();
		achievementsList10.setContent("30일 연속 출석하기");
		achievementsList10.setExp(200);
		achievementsList10.setGoal(30);
		achievementsList10.setTitle("한 달의 여정");
		achievementsList10.setType("attendance");
		achievementsList10.setCategory("출석");
		achievementsListRep.save(achievementsList10);
		
		// 출석 관련 업적
		AchievementsList achievementsList11 = new AchievementsList();
		achievementsList11.setContent("100일 연속 출석하기");
		achievementsList11.setExp(300);
		achievementsList11.setGoal(100);
		achievementsList11.setTitle("백일정진");
		achievementsList11.setType("attendance");
		achievementsList11.setCategory("출석");
		achievementsListRep.save(achievementsList11);
		
		AchievementsList achievementsList12 = new AchievementsList();
		achievementsList12.setContent("365일 연속 출석하기");
		achievementsList12.setExp(3650);
		achievementsList12.setGoal(365);
		achievementsList12.setTitle("하루도 빠짐없이");
		achievementsList12.setType("attendance");
		achievementsList12.setCategory("출석");
		achievementsListRep.save(achievementsList12);
		
		AchievementsList achievementsList13 = new AchievementsList();
		achievementsList13.setContent("1000일 연속 출석하기");
		achievementsList13.setExp(10000);
		achievementsList13.setGoal(1000);
		achievementsList13.setTitle("천일의 대서사시");
		achievementsList13.setType("attendance");
		achievementsList13.setCategory("출석");
		achievementsListRep.save(achievementsList13);
		
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/quest")
	public ResponseEntity<Void> QuestAdmin() {
		// 퀘스트가 이미 존재하는지 확인
		if (questRep.existsByTitle("아무 활동 5회하기")) {
			return ResponseEntity.badRequest().build();
		}

		// 일일 퀘스트 추가
		Quest dailyQuest1 = new Quest();
		dailyQuest1.setTitle("아무 활동 5회하기");
		dailyQuest1.setDescription("하루 동안 아무 활동을 5회 수행하세요.");
		dailyQuest1.setGoal(5);
		dailyQuest1.setExp(10);
		dailyQuest1.setPoint(50);
		dailyQuest1.setType("DAILY");
		dailyQuest1.setCategory("활동");
		questRep.save(dailyQuest1);

		Quest dailyQuest2 = new Quest();
		dailyQuest2.setTitle("아무 스테이지 클리어하기");
		dailyQuest2.setDescription("하루 동안 아무 스테이지를 클리어하세요.");
		dailyQuest2.setGoal(1);
		dailyQuest2.setExp(15);
		dailyQuest2.setPoint(75);
		dailyQuest2.setType("DAILY");
		dailyQuest2.setCategory("스테이지");
		questRep.save(dailyQuest2);

		Quest dailyQuest3 = new Quest();
		dailyQuest3.setTitle("경험치 100 이상 얻기");
		dailyQuest3.setDescription("하루 동안 100 이상의 경험치를 획득하세요.");
		dailyQuest3.setGoal(100);
		dailyQuest3.setExp(20);
		dailyQuest3.setPoint(100);
		dailyQuest3.setType("DAILY");
		dailyQuest3.setCategory("경험치");
		questRep.save(dailyQuest3);

		Quest dailyQuest4 = new Quest();
		dailyQuest4.setTitle("포인트 200 이상 얻기");
		dailyQuest4.setDescription("하루 동안 200 이상의 포인트를 획득하세요.");
		dailyQuest4.setGoal(200);
		dailyQuest4.setExp(25);
		dailyQuest4.setPoint(150);
		dailyQuest4.setType("DAILY");
		dailyQuest4.setCategory("포인트");
		questRep.save(dailyQuest4);

		Quest dailyQuest5 = new Quest();
		dailyQuest5.setTitle("미디어 1회 보기");
		dailyQuest5.setDescription("하루 동안 미디어를 1회 시청하세요.");
		dailyQuest5.setGoal(1);
		dailyQuest5.setExp(5);
		dailyQuest5.setPoint(25);
		dailyQuest5.setType("DAILY");
		dailyQuest5.setCategory("미디어");
		questRep.save(dailyQuest5);

		// 주간 퀘스트 추가
		Quest weeklyQuest1 = new Quest();
		weeklyQuest1.setTitle("일일퀘스트 10회 클리어");
		weeklyQuest1.setDescription("주간 동안 일일퀘스트를 10회 클리어하세요.");
		weeklyQuest1.setGoal(10);
		weeklyQuest1.setExp(100);
		weeklyQuest1.setPoint(500);
		weeklyQuest1.setType("WEEKLY");
		weeklyQuest1.setCategory("퀘스트");
		questRep.save(weeklyQuest1);

		Quest weeklyQuest2 = new Quest();
		weeklyQuest2.setTitle("5번 접속하기");
		weeklyQuest2.setDescription("주간 동안 5번 접속하세요.");
		weeklyQuest2.setGoal(5);
		weeklyQuest2.setExp(50);
		weeklyQuest2.setPoint(250);
		weeklyQuest2.setType("WEEKLY");
		weeklyQuest2.setCategory("접속");
		questRep.save(weeklyQuest2);

		Quest weeklyQuest3 = new Quest();
		weeklyQuest3.setTitle("단어 시험 보기");
		weeklyQuest3.setDescription("주간 동안 단어 시험을 보세요.");
		weeklyQuest3.setGoal(1);
		weeklyQuest3.setExp(75);
		weeklyQuest3.setPoint(300);
		weeklyQuest3.setType("WEEKLY");
		weeklyQuest3.setCategory("시험");
		questRep.save(weeklyQuest3);

		return ResponseEntity.ok().build();
	}
	
	
}



































