package Project.Backend.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.MyQuest;
import Project.Backend.entity.Quest;
import Project.Backend.entity.User;
import Project.Backend.repository.MyQuestRepository;
import Project.Backend.repository.QuestRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.RewardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/quest")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestController {

	@Autowired
	UserRepository userRep;

	@Autowired
	RewardService rewardService;

	@Autowired
	MyQuestRepository myQuestRep;

	@Autowired
	QuestRepository questRep;

	@GetMapping("/list")
	public ResponseEntity<List<Quest>> AllQuest() {
		List<Quest> quests = questRep.findAll();

		return ResponseEntity.ok(quests);
	}

	@GetMapping("/myquest")
	public ResponseEntity<List<MyQuest>> MyQuestList(@AuthenticationPrincipal UD user) {
		try {
			User userinfo = userRep.findByEmail(user.getEmail());
			List<MyQuest> myQuests = myQuestRep.findByUser(userinfo);

			return ResponseEntity.ok(myQuests);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	
	
	
	
	
	
}













