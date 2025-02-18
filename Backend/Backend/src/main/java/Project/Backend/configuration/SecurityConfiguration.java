package Project.Backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import Project.Backend.classes.UD;
import Project.Backend.services.UDS;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.DispatcherType;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    
    // application.properties에서 불러오기
    @Value("${csrf.ignore.path}")
    String csrf_ignore;

    @Value("${login.page.path}")
    String login_page;

    @Value("${login.process.path}")
    String login_process;

    @Value("${login.username}")
    String username;

    @Value("${login.password}")
    String password;

    @Value("${login.success.path}")
    String login_success;

    @Value("${login.success.oauth.path}")
    String login_oauth_success;

    @Value("${login.failure.path}")
    String login_failure;

    @Value("${login.logout.path}")
    String login_logout;

    @Value("${login.logout.redirect.path}")
    String login_logout_redirect;

    @Autowired
    UDS userdetailsservice;

    @Bean
	public SecurityFilterChain register(HttpSecurity http) throws Exception {
		http
		.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(target->
				target
					.ignoringRequestMatchers(csrf_ignore)
			)
			.authorizeHttpRequests(target->
				target
					.dispatcherTypeMatchers(DispatcherType.FORWARD)
					.permitAll()
					.requestMatchers("/")
					.authenticated()
			        .requestMatchers("/app/**","/api/**") // 현재는 모든 페이지 입장 가능함 + 이건 권한에 대한 예외 페이지
			        .permitAll()
//					.requestMatchers("/app/**","/api/**") // 나중에 권한 넣을 페이지를 위해 안지움
//					.hasAnyRole("USER")
					.anyRequest()
					.permitAll()
			)
	         .formLogin(form -> form
	                   .loginPage(login_page) // 로그인 하는 페이지
	                   .loginProcessingUrl("/login") // 실제 로그인이 작동하는 경로
	                   .usernameParameter(username) // 아이디 이름
	                   .passwordParameter(password) // 비밀번호 이름
	                   .defaultSuccessUrl("/api/loginOk") // 로그인 성공 시 이동하는 페이지
//	                   .failureUrl(login_failure) //이건 없는게 더 좋을수도 있을거 같아서 뺏음
	                   .permitAll() // 저장
	         )
			.logout(target->
				target
					.logoutUrl(login_logout) // 로그아웃 페이지로 이동 시 세션에서 지워줌
					.clearAuthentication(true) 
					.deleteCookies("JSESSIONID") // 쿠키에서 해당 이름을 지움
					.invalidateHttpSession(true)
					.logoutSuccessUrl(login_logout_redirect) // 로그아웃 성공시 이동 할 페이지
			)
			.oauth2Login(target->
				target
					.userInfoEndpoint(endpointTarget->
						endpointTarget
							.userService(userdetailsservice) // 엔드포인트 설정 현재는 UDS로 되어있음
					)
					.defaultSuccessUrl(login_oauth_success) // 성공시 이동할 페이지
					.loginPage(login_page) // 로그인 하는 페이지
//					.failureUrl(login_failure)
					.permitAll() 
			)
			;
		
		return http.getOrBuild();
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostConstruct
    public void setSecurityContextStrategy() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}


