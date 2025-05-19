package com.example.webve.controller;
import java.util.List;

import com.example.webve.model.User;
import com.example.webve.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String listUsers(Model model) {
        List<User> users = userService.findAllUsers(); // Lấy danh sách người dùng
        model.addAttribute("users", users); // Thêm danh sách vào model
        return "userList"; // Trả về trang userList.html
    }

}