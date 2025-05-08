package com.example.eventory.service;

import com.example.eventory.dto.UserDTO;
import com.example.eventory.entity.UserSessions;
import com.example.eventory.entity.User;
import com.example.eventory.repository.UserRepository;
import com.example.eventory.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("user");
        userRepository.save(user);
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        user.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUserId(), user.getRole());

        UserSessions session = new UserSessions();
        session.setSessionId(UUID.randomUUID().toString());
        session.setUserId(user.getUserId());
        session.setToken(token);
        session.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        userSessionRepository.save(session);

        return token;
    }
}