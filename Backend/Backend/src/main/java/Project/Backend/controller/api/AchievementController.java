package Project.Backend.controller.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.AchievementsList;
import Project.Backend.entity.MyAchievements;
import Project.Backend.entity.User;
import Project.Backend.repository.AchievementsListRepository;
import Project.Backend.repository.MyAchievementsRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.AchieveService;
import Project.Backend.services.RewardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/achievement")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementController {

	@Autowired
	AchievementsListRepository achievementsListRep;

	@Autowired
	MyAchievementsRepository myAchievementsRep;

	@Autowired
	UserRepository userRep;

	@Autowired
	AchieveService achieveService;
	
	@Autowired
	RewardService rewardService;

	@GetMapping("/list")
	public ResponseEntity<List<AchievementsList>> Allachievement() {
		List<AchievementsList> achievementsLists = achievementsListRep.findAll();

		return ResponseEntity.ok(achievementsLists);
	}

	@GetMapping("/myachieve")
	public ResponseEntity<List<MyAchievements>> MyachieveList(@AuthenticationPrincipal UD user) {
		try {
			User userinfo = userRep.findByEmail(user.getEmail());
			List<MyAchievements> myAchievements = myAchievementsRep.findByUser(userinfo);

			return ResponseEntity.ok(myAchievements);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// 특정 유저의 업적 목록 조회
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<MyAchievements>> getUserAchievements(@PathVariable Long userId) {
		User user = userRep.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		List<MyAchievements> achievements = myAchievementsRep.findByUser(user);
		return ResponseEntity.ok(achievements);
	}

	@PutMapping("/update/{userId}/{achievementId}/{newStatement}")
	public ResponseEntity<MyAchievements> updateAchievement(@PathVariable Long userId, @PathVariable Long achievementId,
			@PathVariable int newStatement) {
		try {
			User user = userRep.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
			AchievementsList achievement = achievementsListRep.findById(achievementId)
					.orElseThrow(() -> new RuntimeException("Achievement not found"));
			
			MyAchievements myAchievement = myAchievementsRep.findByUserAndAchievementsList(user, achievement);
			if (myAchievement == null) {
				myAchievement = new MyAchievements();
				myAchievement.setUser(user);
				myAchievement.setAchievementsList(achievement);
			}

			myAchievement.setGoal(newStatement);

			if (newStatement >= achievement.getGoal() && myAchievement.getAchieved_at() == null) {
				myAchievement.setAchieved_at(LocalDateTime.now());
			} else if (newStatement < achievement.getGoal()) {
				myAchievement.setAchieved_at(null);
			}

			MyAchievements updated = myAchievementsRep.save(myAchievement);
			return ResponseEntity.ok(updated);

		} catch (RuntimeException e) {
			System.out.println(e);
			return ResponseEntity.badRequest().build();
		}
	}
	
	@PostMapping("/claim")
	@Transactional
	public ResponseEntity<?> claimReward(
	        @RequestBody Map<String, String> entity,
	        @AuthenticationPrincipal UD user) {
	    try {
	        // 업적 조회
	        String title = entity.get("title");
	        if (title == null) {
	            return ResponseEntity.badRequest().body("업적 제목이 필요합니다.");
	        }

	        AchievementsList achievement = achievementsListRep.findByTitle(title);
	        if (achievement == null) {
	            return ResponseEntity.badRequest().body("해당 업적이 존재하지 않습니다.");
	        }

	        User userinfo = userRep.findByEmail(user.getEmail());
	        if (userinfo == null) {
	            return ResponseEntity.badRequest().body("사용자 정보를 찾을 수 없습니다.");
	        }
	        
	        MyAchievements myAchievement = myAchievementsRep.findByAchievementsListAndUser(achievement, userinfo);
	        if (myAchievement == null) {
	            return ResponseEntity.badRequest().body("해당 업적을 찾을 수 없습니다.");
	        }

	        // 업적 달성 여부 확인
	        if (myAchievement.getAchieved_at() == null || 
	            myAchievement.getGoal() < myAchievement.getAchievementsList().getGoal()) {
	            return ResponseEntity.badRequest().body("아직 달성하지 않은 업적입니다.");
	        }

	        // null 체크 추가
	        Boolean isRewardClaimed = myAchievement.getIsRewardClaimed();
	        if (isRewardClaimed != null && isRewardClaimed) {
	            return ResponseEntity.badRequest().body("이미 보상을 수령했습니다.");
	        }

	        // 보상 지급
//	        userinfo.setPoint(userinfo.getPoint() + myAchievement.getAchievementsList().getExp());
//	        userRep.save(userinfo);
	        
	        rewardService.InputReward(userinfo, "point", myAchievement.getAchievementsList().getExp());
	        

	        // 보상 수령 상태 업데이트
	        myAchievement.setIsRewardClaimed(true);
	        myAchievementsRep.save(myAchievement);

	        return ResponseEntity.ok().build();
	        
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(e.getMessage());
	    }
	}
	
	
	
	@GetMapping("/attend")
	public ResponseEntity<?> attend(@AuthenticationPrincipal UD user) {
	    User userinfo = userRep.findByEmail(user.getEmail());
	    LocalDate today = LocalDate.now();
	    LocalDate lastVisit = userinfo.getVisited_at();
	    
	    // 첫 방문인 경우
	    if (lastVisit == null) {
	    	achieveService.ResetAttend("attendance", userinfo);
	        userinfo.setVisited_at(today);
	    } 
	    // 이미 오늘 방문한 경우
	    else if (lastVisit.equals(today)) {
	        return ResponseEntity.ok().build(); // 아무 작업도 하지 않음
	    }
	    // 어제 방문한 경우 (연속 출석)
	    else if (ChronoUnit.DAYS.between(lastVisit, today) == 1) {
	    	achieveService.InputAchieveGoal("attendance", userinfo);
	        userinfo.setVisited_at(today);
	    }
	    // 하루 이상 건너뛴 경우
	    else {
	    	achieveService.ResetAttend("attendance", userinfo);
	        userinfo.setVisited_at(today);
	    }
	    
	    userRep.save(userinfo);
	    return ResponseEntity.ok().build();
	}
	
}



























