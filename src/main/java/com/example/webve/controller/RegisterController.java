package com.example.webve.controller;

import com.example.webve.model.User;
import com.example.webve.service.EmailService;
import com.example.webve.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RegisterController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register"; // Trả về tên view cho trang đăng ký
    }

    @PostMapping("/register")
    public String registerUser (User user) {
        userService.registerUser (user);
        emailService.send(user.getEmail(), "Cảm ơn bạn đã đăng ký!");
        return "register_success"; // Trả về tên view cho trang thành công
    }
}