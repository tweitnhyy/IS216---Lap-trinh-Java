package com.example.webve.controller;

import com.example.webve.dto.AuthResponse;
import com.example.webve.dto.UserDTO;
import com.example.webve.service.AuthService;
import com.example.webve.service.JwtService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        logger.info("Registering user with email: {}", userDTO.getEmail());
        authService.register(userDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserDTO userDTO) {
        logger.info("Login attempt for email: {}", userDTO.getEmail());
        String token = authService.login(userDTO.getEmail(), userDTO.getPassword());
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        logger.info("Login successful for email: {}", userDTO.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        logger.info("Fetching user info with Authorization header: {}", authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Authorization header found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7).trim();
        if (!isValidJwtFormat(token)) {
            logger.warn("Invalid JWT format: {}", token);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String userId = jwtService.extractUserId(token);
        if (userId == null || !jwtService.isTokenValid(token, userId)) {
            logger.warn("Invalid or expired token for userId: {}", userId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDTO user = authService.getUserInfo(userId);
        if (user == null) {
            logger.warn("User not found for userId: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);
    }

    private boolean isValidJwtFormat(String token) {
        return token != null && !token.isEmpty() && token.split("\\.").length == 3;
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        logger.info("Logout request with Authorization header: {}", authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Authorization header found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        authService.logout(token);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<UserDTO> updateUserProfile(@PathVariable String userId, @Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = authService.updateUserProfile(userId, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody UserDTO userDTO) {
        String email = userDTO.getEmail();
        logger.info("Forgot password request for email: {}", email);
        boolean isSent = authService.initiatePasswordReset(email);
        if (isSent) {
            return ResponseEntity.ok("Yêu cầu đặt lại mật khẩu đã được gửi tới email.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email không tồn tại trong hệ thống.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        logger.info("Reset password attempt for token: {}", request.getToken());
        boolean result = authService.resetPassword(request.getToken(), request.getNewPassword());
        if (result) {
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token không hợp lệ hoặc đã hết hạn.");
        }
    }

    // DTO nội bộ cho reset password
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
