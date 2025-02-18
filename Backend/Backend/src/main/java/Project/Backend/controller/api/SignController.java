package Project.Backend.controller.api;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.classes.UD;
import Project.Backend.entity.Inventory;
import Project.Backend.entity.Store;
import Project.Backend.entity.User;
import Project.Backend.repository.InventoryRepository;
import Project.Backend.repository.StoreRepository;
import Project.Backend.repository.UserRepository;
import Project.Backend.services.MailService;
import Project.Backend.services.UDS;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SignController {

	private final MailService mailService;

	@Autowired
	UserRepository userRep;

	@Autowired
	InventoryRepository inventoryRep;

	@Autowired
	StoreRepository storeRep;

	@Autowired
	UDS userService;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private EntityManager entityManager;

	@Value("${auth.user}")
	String userAuth;

	// 이메일 중복 검사
	@PostMapping("/findemail")
	public ResponseEntity<String> ExistsEmail(@RequestParam String email) {
		try {
			boolean exists = userRep.existsByEmail(email);
			User user = userRep.findByEmail(email);
			if (exists) {
				if (user.getProvider() != "회원가입") {
					return ResponseEntity.status(HttpStatus.CONFLICT).body("변경불가");
				} else {
					return ResponseEntity.status(HttpStatus.CONFLICT).body("exists");
				}
			} else {
				return ResponseEntity.ok("available");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
		}
	}

	// 회원가입을 통한 유저 생성
	@PostMapping("/signup")
	public ResponseEntity<String> signup(@RequestParam String email, @RequestParam String pw) {
//    	System.out.println("Received email: " + email + ", password: " + pw);
		// 이메일 중복 체크
		if (userRep.findByEmail(email) != null) {
			return ResponseEntity.status(409).body("이미 존재하는 이메일입니다.");
		}

		String nullName = "Nameisnull";
		User user = new User();
		user.setName(nullName);
		user.setEmail(email);
		user.setPw(passwordEncoder.encode(pw)); // 비밀번호 암호화
		user.setProvider("회원가입");
		user.setExp(0); // 초기 경험치 설정
		user.setGrade(0); // 초기 등급 설정
		user.setPoint(0); // 초기 포인트 설정
		user.setRole(userAuth); // 유저 권한 설정 나중에 어드민넣을때 쓸 예정
		user.setFirstsignup(LocalDate.now());
		userRep.save(user); // User 저장

		return ResponseEntity.ok("회원가입 성공");
	}

	// 회원가입 이후 최초 로그인 한 유저의 프로필 설정
	@PostMapping("/profile")
	public ResponseEntity<String> Profile(@RequestParam String nickname, @RequestParam String birthday,
			@RequestParam String basicSkin, @AuthenticationPrincipal UD user) {
		entityManager.clear();
//		System.out.println("닉네임 : "+nickname+" 생일 : " + birthday+" 스킨 번호 : " + basicSkin);

		LocalDate birthDate = LocalDate.parse(birthday);
		Store skin = storeRep.findByItemCategory(basicSkin);
		Store BG = storeRep.findByItemCategory("Background-0");
		Store NamePlate = storeRep.findByItemCategory("NamePlate-0");

		if (skin == null) {
			return ResponseEntity.badRequest().build();
		}

		User sessionuser = userRep.findByEmail(user.getEmail());
		sessionuser.setName(nickname);
		sessionuser.setBirthdate(birthDate);
		userRep.save(sessionuser);

		Inventory setskin = new Inventory();
		setskin.setUser(sessionuser);
		setskin.setState(true);
		setskin.setStore(skin);
		inventoryRep.save(setskin);
		
		Inventory setBG = new Inventory();
		setBG.setUser(sessionuser);
		setBG.setState(true);
		setBG.setStore(BG);
		inventoryRep.save(setBG);
		
		Inventory setNamePlate = new Inventory();
		setNamePlate.setUser(sessionuser);
		setNamePlate.setState(true);
		setNamePlate.setStore(NamePlate);
		inventoryRep.save(setNamePlate);
		
		// 중간에 퀘스트 지정하는 페이지 넣을 가능성 있어서 수정예정
		return ResponseEntity.ok("프로필 설정");
	}

	// 인증 이메일 전송
	@PostMapping("/mailSend")
	public HashMap<String, Object> mailSend(@RequestParam String email) {
		HashMap<String, Object> map = new HashMap<>();
		try {
			mailService.sendMail(email);
			map.put("success", true);
			map.put("message", "인증 메일이 발송되었습니다.");
		} catch (Exception e) {
			map.put("success", false);
			map.put("error", "메일 발송 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}

		return map;
	}

	// 인증번호 확인
	@GetMapping("/mailCheck")
	public ResponseEntity<HashMap<String, Object>> mailCheck(@RequestParam String mail, @RequestParam int userNumber) {
		HashMap<String, Object> response = new HashMap<>();

		boolean isMatch = mailService.checkVerificationNumber(mail, userNumber);

		if (isMatch) {
			response.put("success", true);
			response.put("message", "인증이 성공적으로 완료되었습니다.");
			return ResponseEntity.ok(response); // 200 OK
		} else {
			response.put("success", false);
			response.put("message", "인증 번호가 일치하지 않습니다.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 400 Bad Request
		}
	}

	// 비밀번호 변경
	@PostMapping("/changePW")
	public ResponseEntity<?> ChangePW(@RequestParam String pw, @RequestParam String email) {
		User user = userRep.findByEmail(email);
		user.setPw(passwordEncoder.encode(pw));
		userRep.save(user);

		return ResponseEntity.ok().build();
	}

	// 로그인이 완료되면 유저 정보를 담아서 보내줌( 없어도 무관함 )
	@GetMapping("/loginOk")
	public ResponseEntity<Map<String, String>> loginOk() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		String authorities = authentication.getAuthorities().toString();

//        System.out.println("로그인한 유저 이메일:" + email);
//        System.out.println("유저 권한:" + authentication.getAuthorities());

		Map<String, String> userInfo = new HashMap<>();
		userInfo.put("email", email);
		userInfo.put("authorities", authorities);

		return ResponseEntity.ok(userInfo);
	}

}
