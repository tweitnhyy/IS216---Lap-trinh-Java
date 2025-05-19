package com.example.webve.controller;

import com.example.webve.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ResetPasswordController {

    @Autowired
    private UserService userService;

    @GetMapping("/reset-password")
    public String showResetForm(@RequestParam("token") String token, Model model) {
        model.addAttribute("token", token);
        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String handleReset(@RequestParam("token") String token,
                              @RequestParam("password") String password,
                              HttpServletRequest request,
                              Model model) {
        boolean result = userService.updatePassword(token, password);
        if (result) {
            // Xoá session và context để tránh giữ mật khẩu cũ
            request.getSession().invalidate();
            SecurityContextHolder.clearContext();

            model.addAttribute("message", "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.");
            return "login"; // Chuyển hướng đến trang đăng nhập
        } else {
            model.addAttribute("error", "Token không hợp lệ hoặc đã hết hạn.");
            model.addAttribute("token", token); // Giữ lại token để người dùng thử lại
            return "reset-password";
        }
    }
}
