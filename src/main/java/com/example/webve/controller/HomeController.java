package com.example.webve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String showHomePage() {
        return "index";  // Trang chủ của web, hiển thị các thông tin nổi bật hoặc danh sách concert
    }
}
