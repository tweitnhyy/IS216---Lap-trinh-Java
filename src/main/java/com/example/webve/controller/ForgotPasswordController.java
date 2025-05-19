package com.example.webve.controller;

import com.example.webve.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ForgotPasswordController {

    @Autowired
    private UserService userService;

    @GetMapping("/forgot-password")
    public String showForgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(@RequestParam("email") String email,
                                        HttpServletRequest request,
                                        Model model) {
        String token = userService.createPasswordResetToken(email);
        if (token == null) {
            model.addAttribute("error", "Email không tồn tại.");
            return "forgot-password";
        }

        String resetLink = getSiteURL(request) + "/reset-password?token=" + token;
        userService.sendResetEmail(email, resetLink);

        model.addAttribute("message", "Liên kết đặt lại mật khẩu đã được gửi qua email.");
        return "forgot-password";
    }

    private String getSiteURL(HttpServletRequest request) {
        return request.getRequestURL().toString().replace(request.getServletPath(), "");
    }
}
