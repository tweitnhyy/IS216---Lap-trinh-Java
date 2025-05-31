package com.example.webve.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class AdviceController {
    @ModelAttribute("activePage")
    public String activePage(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.equals("/") ? "home" : uri.substring(1);
    }
}
