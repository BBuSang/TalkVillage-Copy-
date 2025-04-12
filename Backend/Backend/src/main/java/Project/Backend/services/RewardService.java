package Project.Backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Project.Backend.entity.User;
import Project.Backend.repository.AchievementsListRepository;
import Project.Backend.repository.MyAchievementsRepository;
import Project.Backend.repository.UserRepository;

@Service
public class RewardService {
	
	@Autowired
	UserRepository userRep;
	
	@Autowired
	MyAchievementsRepository myAchievementsRep;
	
	@Autowired
	AchievementsListRepository achievementsListRep;
	
	@Autowired
	AchieveService achieveService;
	
	
	public void InputReward(User user, String type, Integer amount) {
	    if(type == "exp") {
	        int currentExp = user.getExp() + amount;
	        user.setExp(currentExp);
	        
	        // 레벨 계산
	        int level = 1;
	        while (level <= 100) {
	            int requiredExp = calculateRequiredExp(level);
	            if (currentExp < requiredExp) {
	                break;
	            }
	            level++;
	        }
	        achieveService.InputAchieveGoal("level", user, level);
	        
	    }
	    if(type == "point") {
	        user.setPoint(user.getPoint() + amount);
	        achieveService.InputAchieveGoal("point", user, amount);
	        
	    }
	    
	    userRep.save(user);
	}

	// 해당 레벨에 필요한 누적 경험치 계산
	private int calculateRequiredExp(int level) {
	    if (level == 1) return 100;
	    
	    double baseExp = 100;
	    double totalExp = baseExp;
	    
	    for (int i = 2; i <= level; i++) {
	        baseExp *= 1.12; // 12% 증가
	        totalExp += Math.floor(baseExp);
	    }
	    
	    return (int) totalExp;
	}
}
