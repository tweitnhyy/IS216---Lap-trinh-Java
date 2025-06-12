package com.example.webve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/admin")
    public String adminHome () {
        return "admin/admin";
    }
    @GetMapping("/dashboard")
    public String dashboard () {
        return "admin/dashboard";
    }
    @GetMapping("/test")
    public String test () {
        return "admin/test";
    }
}
