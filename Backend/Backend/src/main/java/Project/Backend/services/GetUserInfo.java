package Project.Backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Project.Backend.entity.MyStage;
import Project.Backend.entity.User;
import Project.Backend.repository.MyStageRepository;
import Project.Backend.repository.UserRepository;

@Service
public class GetUserInfo {
	
	@Autowired
	UserRepository UserRep;
	
	@Autowired
	MyStageRepository MyStageRep;
	
	// 닉네임 받아오기
	// 스킨 이미지 받아오기 --> 아직 안 넣음 
	// 해당 유저에 초중고 스테이지 받아오기 
	
	public String GetUserNickName(User User) {
		User UserInfo = UserRep.findByUserId(User);
		return UserInfo.getName();
	}
	
	public String GetMyStage(User User, String Difficulty) {
		MyStage MyStage = MyStageRep.findByuser(User);
		if ("easy".equals(Difficulty)) {
		    return MyStage.getEasy();
		} else if ("normal".equals(Difficulty)) {
		    return MyStage.getNormal();
		} else if ("hard".equals(Difficulty)) {
		    return MyStage.getHard();
		} else {
			return null;
		}
		
	}
}
