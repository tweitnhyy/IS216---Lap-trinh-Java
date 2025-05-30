package com.example.webve.service;

import com.example.webve.dto.UserDTO;
import com.example.webve.model.User;
import com.example.webve.model.UserSessions;
import com.example.webve.repository.UserRepository;
import com.example.webve.repository.UserSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public void register(UserDTO userDTO) {
        if (userDTO.getUsername() == null || userDTO.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (userDTO.getEmail() == null || !EMAIL_PATTERN.matcher(userDTO.getEmail()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        String usID = UUID.randomUUID().toString();
        User user = new User();
        user.setUserId(usID);
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("user"); // Sử dụng vai trò in hoa
        userRepository.save(user);
    }

    public String login(String email, String password) {
        if (email == null || password == null) {
            throw new IllegalArgumentException("Email and password cannot be null");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found after authentication");
        }

        User user = userOpt.get();
        if (user.getUserId() == null) {
            logger.error("User ID is null for email: {}", email);
            throw new IllegalStateException("User ID is missing, please contact support.");
        }

        user.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUserId(), user.getRole());

        String ssID = UUID.randomUUID().toString();
        UserSessions session = new UserSessions();
        session.setSessionId(ssID);
        session.setUserId(user.getUserId());
        session.setToken(token);
        session.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        userSessionRepository.save(session);

        return token;
    }

    public UserDTO getUserInfo(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public void logout(String token) {
        if (token == null) {
            throw new IllegalArgumentException("Token cannot be null");
        }
        Optional<UserSessions> sessionOpt = userSessionRepository.findByToken(token);
        if (sessionOpt.isPresent()) {
            userSessionRepository.delete(sessionOpt.get());
        } else {
            logger.warn("No session found for token: {}", token);
        }
    }
}