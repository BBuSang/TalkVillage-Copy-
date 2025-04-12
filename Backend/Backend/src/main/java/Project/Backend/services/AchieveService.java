package Project.Backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Project.Backend.entity.AchievementsList;
import Project.Backend.entity.MyAchievements;
import Project.Backend.entity.User;
import Project.Backend.repository.AchievementsListRepository;
import Project.Backend.repository.MyAchievementsRepository;
import Project.Backend.repository.UserRepository;
import opennlp.tools.stemmer.snowball.indonesianStemmer;

@Service
@Transactional
public class AchieveService {

	@Autowired
	AchievementsListRepository achievementsListRep;

	@Autowired
	MyAchievementsRepository myAchievementsRep;
	
	@Autowired
	UserRepository userRep;

	public void InputAchieveGoal(String Type, User user) {
	    try {
	        List<AchievementsList> achievementsLists = achievementsListRep.findByType(Type);
	        List<MyAchievements> myachievements = myAchievementsRep.findByUser(user);

	        for (AchievementsList achievementsList : achievementsLists) {
	            MyAchievements existingAchievement = myachievements.stream()
	                .filter(ma -> ma.getAchievementsList().getAchievementId() == achievementsList.getAchievementId())
	                .findFirst()
	                .orElse(null);

	            if (existingAchievement != null) {
	                // 이미 달성한 업적은 건너뛰기
	                if (existingAchievement.getAchieved_at() != null) {
	                    continue;
	                }
	                
	                // 연속 출석 카운트 증가
	                existingAchievement.setGoal(existingAchievement.getGoal() + 1);
	                
	                // 목표 달성 시 달성 시간 설정
	                if (existingAchievement.getGoal() >= achievementsList.getGoal()) {
	                    existingAchievement.setAchieved_at(LocalDateTime.now());
	                }
	                
	                myAchievementsRep.save(existingAchievement);
	            } else {
	                // 새로운 업적 생성
	                MyAchievements newAchievement = new MyAchievements();
	                newAchievement.setUser(user);
	                newAchievement.setAchievementsList(achievementsList);
	                newAchievement.setGoal(1);
	                
	                if (achievementsList.getGoal() == 1) {
	                    newAchievement.setAchieved_at(LocalDateTime.now());
	                }
	                
	                myAchievementsRep.save(newAchievement);
	            }
	        }
	    } catch (Exception e) {
	        System.out.println(e);
	    }
	}
	public void InputAchieveGoal(String Type, User user, Integer amount) {
	    try {
	        List<AchievementsList> achievementsLists = achievementsListRep.findByType(Type);
	        List<MyAchievements> myachievements = myAchievementsRep.findByUser(user);

	        for (AchievementsList achievementsList : achievementsLists) {
	            MyAchievements existingAchievement = myachievements.stream()
	                .filter(ma -> ma.getAchievementsList().getAchievementId() == achievementsList.getAchievementId())
	                .findFirst()
	                .orElse(null);

	            if (existingAchievement != null) {
	                // 이미 달성한 업적은 건너뛰기
	                if (existingAchievement.getAchieved_at() != null) {
	                    continue;
	                }
	                
	                // 연속 출석 카운트 증가
	                existingAchievement.setGoal(existingAchievement.getGoal() + amount);
	                
	                if (Type.equals("level")) {
	                	existingAchievement.setGoal(amount);
					}
	                
	                // 목표 달성 시 달성 시간 설정
	                if (existingAchievement.getGoal() >= achievementsList.getGoal()) {
	                	existingAchievement.setGoal(achievementsList.getGoal());
	                    existingAchievement.setAchieved_at(LocalDateTime.now());
	                }
	                
	                myAchievementsRep.save(existingAchievement);
	            } else {
	                // 새로운 업적 생성
	                MyAchievements newAchievement = new MyAchievements();
	                newAchievement.setUser(user);
	                newAchievement.setAchievementsList(achievementsList);
	                newAchievement.setGoal(amount);
	                
	                // 목표 달성 시 달성 시간 설정
	                if (newAchievement.getGoal() >= achievementsList.getGoal()) {
	                	newAchievement.setGoal(achievementsList.getGoal());
	                	newAchievement.setAchieved_at(LocalDateTime.now());
	                }
	                
	                if (achievementsList.getGoal() == 1) {
	                    newAchievement.setAchieved_at(LocalDateTime.now());
	                }
	                
	                myAchievementsRep.save(newAchievement);
	            }
	        }
	    } catch (Exception e) {
	        System.out.println(e);
	    }
	}
	
	public void ResetAttend(String Type, User user) {
		try {
			List<AchievementsList> achievementsLists = achievementsListRep.findByType(Type);
			List<MyAchievements> myachievements = myAchievementsRep.findByUser(user);

			for (AchievementsList achievementsList : achievementsLists) {
				boolean exists = false;
				
				// 사용자의 업적이 비어있지 않은 경우에만 순회
				if (!myachievements.isEmpty()) {
					for (MyAchievements myAchievement : myachievements) {
						if (myAchievement.getAchievementsList().getAchievementId() == achievementsList.getAchievementId()) {
							if(myAchievement.getAchieved_at()!=null) {
								break;
							}
							myAchievement.setGoal(1);
							myAchievementsRep.save(myAchievement);
							exists = true;
							break;
						}
					}
				}
				
				// 업적이 존재하지 않으면 새로 생성
				if (!exists) {
					MyAchievements newAchievement = new MyAchievements();
					newAchievement.setUser(user);
					newAchievement.setAchievementsList(achievementsList);
					
					if (achievementsList.getGoal() == 1) {
						newAchievement.setGoal(1);
						newAchievement.setAchieved_at(LocalDateTime.now());
					} else {
						newAchievement.setGoal(1);
					}
					myAchievementsRep.save(newAchievement);
				}
			}
		} catch (Exception e) {
			System.out.println(e);
		}
	}

}
