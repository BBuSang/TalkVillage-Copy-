package Project.Backend.classes;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import Project.Backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UD implements UserDetails, OAuth2User {

    private User user;

    public UD(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 리스트 생성
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // User의 권한이 ROLE_USER와 같은 형태로 저장되어 있다고 가정하고 이를 추가
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));  // 예: ROLE_ADMIN, ROLE_USER 등
        
        return authorities;  // 반환
    }

    @Override
    public String getPassword() {
        return user.getPw();
    }

    @Override
    public String getUsername() {
        return user.getName();
    }

    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return user.getAttributes();  // OAuth2User의 경우 사용됨
    }

    @Override
    public String getName() {
        return user.getName();
    }
}
