package Project.Backend.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import Project.Backend.classes.UD;
import Project.Backend.entity.User;
import Project.Backend.repository.UserRepository;

@Service
public class UDS extends DefaultOAuth2UserService implements UserDetailsService {

	@Autowired
	UserRepository userRep;

	@Value("${auth.user}")
	String userAuth;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oauth2user = super.loadUser(userRequest);
		String provider = userRequest.getClientRegistration().getRegistrationId();
		String email = "";
		Map<String, Object> attributes = oauth2user.getAttributes();
		Map<String, Object> response = null;

		if (provider.equals("google")) {
			email = (attributes.get("email") != null ? attributes.get("email").toString() : "unknown");
		} else if (provider.equals("kakao")) {
			Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
			email = (kakaoAccount != null && kakaoAccount.get("email") != null ? kakaoAccount.get("email").toString()
					: "unknown");
		} else if (provider.equals("naver")) {
			response = (Map<String, Object>) attributes.get("response");
			email = (response != null && response.get("email") != null ? response.get("email").toString() : "unknown");
		}

		User user = userRep.findByEmail(email);
		String Nullname = "Nameisnull";
		if (user == null) {
			user = new User();
			user.setName(Nullname);
			user.setEmail(email);
			user.setPw(provider + "에서 최초 로그인함");
			user.setExp(0);
			user.setGrade(0);
			user.setPoint(0);
			user.setProvider(provider); // 프로바이더를 넣어야 함
			user.setRole(userAuth);
			user.setFirstsignup(LocalDate.now());
			userRep.save(user);
		}
		return new UD(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRep.findByEmail(username);
		if (user == null) {
			throw new UsernameNotFoundException(username);
		}
		return new UD(user);
	}

	public User findByEmail(String email) {
		return userRep.findByEmail(email);
	}

	public User findByName(String Name) {
		return userRep.findByName(Name);
	}

	public List<User> searchUsers(String name, String email) {
		if (name != null && !name.isEmpty()) {
			return userRep.findByNameContainingIgnoreCase(name);
		} else if (email != null && !email.isEmpty()) {
			return userRep.findByEmailContainingIgnoreCase(email);
		} else {
			return new ArrayList<>();
		}
	}

	public User updateUser(Long userId, User updatedUser) {
		// 해당 ID의 사용자 조회
		User user = userRep.findById(userId).orElse(null);
		// 사용자 정보가 없으면 null 반환
		if (user == null) {
			return null;
		}
		// 유저 정보 업데이트
		user.setEmail(updatedUser.getEmail());
		user.setName(updatedUser.getName());
		user.setBirthdate(updatedUser.getBirthdate());
		user.setRole(updatedUser.getRole());
		user.setPoint(updatedUser.getPoint());
		user.setExp(updatedUser.getExp());
		user.setGrade(updatedUser.getGrade());
		user.setEditinfo(updatedUser.getEditinfo());

		// 업데이트된 유저 저장
		return userRep.save(user);
	}

}
























