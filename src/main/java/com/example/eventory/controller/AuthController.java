package com.example.eventory.controller;

import com.example.eventory.dto.AuthResponse;
import com.example.eventory.dto.UserDTO;
import com.example.eventory.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        authService.register(userDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserDTO userDTO) {
        String token = authService.login(userDTO.getEmail(), userDTO.getPassword());
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        return ResponseEntity.ok(response);
    }
}