package Project.Backend.controller.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/app")
@CrossOrigin(origins = "http://localhost:3000")
public class AppController {
	
	@GetMapping("/login")
	public String login() {
		return "redirect:http://localhost:3000/ProfileSettings";
	}
}
