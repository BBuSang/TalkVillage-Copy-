package Project.Backend.controller.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/saveReturnUrl")
    public void saveReturnUrl(@RequestBody ReturnUrlRequest request, HttpSession session) {
        session.setAttribute("returnUrl", request.getReturnUrl());
    }
}

class ReturnUrlRequest {
    private String returnUrl;
    
    public String getReturnUrl() {
        return returnUrl;
    }
    
    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }
} 