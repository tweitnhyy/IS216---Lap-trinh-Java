package com.example.webve.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void send(String to, String email) {
        // Logic gửi email
        System.out.println("Gửi email đến: " + to);
        System.out.println("Nội dung email: " + email);
    }
}